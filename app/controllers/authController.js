import { validationResult } from "express-validator";
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import path from "path";

import mailNotification from "../jobs/mail-notification.js";
import message from "../../lang/messages.js";
import db from "../models/index.js";

export default class AuthController {
  /**----- login page view -----**/
  static async loginView(request, response) {
    try {
      return response.render(path.resolve("views/auth/login"), {
        title: "Sign In",
      });
    } catch (error) {
      return response.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
      });
    }
  }

  /**----- user login functionality  -----**/
  static async login(request, response) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        let data = {};
        errors.array().forEach((item, index) => {
          data[item.path] = { msg: item.msg, val: item.value };
        });
        return response.render(path.resolve("views/auth/login"), {
          title: "Sign In",
          ...data,
          data: request.body,
        });
      } else {
        const { email, password } = request.body;
        const user = await db.User.findOne({ where: { email } });
        if (user && bcrypt.compareSync(password, user.password)) {
          if (!user.status) {
            return response.render(path.resolve("views/auth/login"), {
              title: "Sign In",
              error: message("account-inactive", { name: user.name }),
              data: request.body,
            });
          }

          request.session.user = user.toJSON();
          if (!user.verifiedAt) {
            return response.redirect("/verify");
          } else if (user.role == 0) {
            return response.redirect("/admin/dashboard");
          } else if (user.role == 1) {
            return response.redirect("/user/dashboard");
          }
        } else {
          return response.render(path.resolve("views/auth/login"), {
            title: "Sign In",
            password: { msg: message("loginError") },
            data: request.body,
          });
        }
      }
    } catch (error) {
      return response.render(path.resolve("views/auth/login"), {
        title: "Sign In",
        error: error.message,
        data: request.body,
      });
    }
  }

  /**----- register page view -----**/
  static async registerView(request, response) {
    try {
      return response.render(path.resolve("views/auth/register"), {
        title: "Sign Up",
      });
    } catch (error) {
      return response.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
      });
    }
  }

  /**----- user register functionality  -----**/
  static async register(request, response) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        let data = {};
        errors.array().forEach((item, index) => {
          data[item.path] = { msg: item.msg, val: item.value };
        });
        return response.render(path.resolve("views/auth/register"), {
          title: "Sign Up",
          ...data,
          data: request.body,
        });
      } else {
        let hashedPassword = await bcrypt.hash(request.body.password, 8);
        let { name, email } = request.body;
        let user = await db.User.create({
          name,
          email,
          password: hashedPassword,
          role: "1",
          status: 1,
        });
        request.session.user = user.toJSON();
        await mailNotification.add("send-welcome-email", {
          name: user.name,
          email: user.email,
        });
        return response.redirect("/user/dashboard");
      }
    } catch (error) {
      return response.render(path.resolve("views/auth/register"), {
        title: "Sign Up",
        error: error.message,
        data: request.body,
      });
    }
  }

  /**----- user account verify view ------**/
  static async verify(request, response) {
    try {
      const status = await db.User.findByPk(request.session.user.id);
      if (!status.verifiedAt) {
        return response.render(path.resolve("views/auth/verify"), {
          title: "Account Verify",
        });
      } else {
        return response.redirect("/");
      }
    } catch (error) {
      return response.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
      });
    }
  }

  /**----- account verify link resend functionality -----**/
  static async resendVerificationlink(request, response) {
    try {
      const user = await db.User.findByPk(request.session.user.id);
      if (user !== null) {
        user.resetToken = uuidv4();
        await user.save();
        await mailNotification.add("send-verification-email", {
          name: user.name,
          email: user.email,
          resetToken: user.resetToken,
        });
        return response.render(path.resolve("views/auth/verify"), {
          title: "Account Verify",
          success: message("verificationlinksend", { email: user.email }),
        });
      } else {
        throw new Error(message("user-info-error"));
      }
    } catch (error) {
      return response.render(path.resolve("views/auth/verify"), {
        title: "Account Verify",
        error: error.message,
      });
    }
  }

  /**----- link click account verify function -----**/
  static async verifyEmail(request, response) {
    try {
      const { token } = request.params;
      const user = await db.User.findOne({ where: { resetToken: token } });
      if (user) {
        user.verifiedAt = new Date();
        user.resetToken = null;
        request.session.user = user.toJSON();
        await user.save();
        if (user.role == 0) {
          return response.redirect("/admin/dashboard");
        } else if (user.role == 1) {
          return response.redirect("/user/dashboard");
        }
      } else {
        return response.json({ error: message("token-expired") });
      }
    } catch (error) {
      return response.json({ error: error.message });
    }
  }

  /**----- forgot email page view ------**/
  static async sendResetLinkView(request, response) {
    try {
      return response.render(path.resolve("views/auth/password-email"), {
        title: "Password Reset",
      });
    } catch (error) {
      return response.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
      });
    }
  }

  /**----- forgot email page view ------**/
  static async sendResetLink(request, response) {
    try {
      const email = request.body.email;
      const user = await db.User.findOne({ where: { email: email } });
      if (user === null) {
        return response.render(path.resolve("views/auth/password-email"), {
          title: "Password Reset",
          error: message("user-not-found"),
        });
      } else {
        user.resetToken = uuidv4();
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();
        await mailNotification.add("send-reset-password-email", {
          name: user.name,
          email: user.email,
          resetToken: user.resetToken,
        });
        return response.render(path.resolve("views/auth/password-email"), {
          title: "Password Reset",
          success: message("reset-link-send"),
        });
      }
    } catch (error) {
      return response.render(path.resolve("views/auth/password-email"), {
        title: "Password Reset",
        error: error.message,
      });
    }
  }

  /**----- reset password page view -----**/
  static async resetPasswordView(request, response) {
    const { token } = request.params;
    return response.render(path.resolve("views/auth/reset-password"), {
      title: "Password Reset",
      token: token,
    });
  }

  /**----- user account password update -----**/
  static async resetPassword(request, response) {
    const { token } = request.params;
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        let data = {};
        errors.array().forEach((item, index) => {
          data[item.path] = { msg: item.msg, val: item.value };
        });
        return response.render(path.resolve("views/auth/reset-password"), {
          title: "Password Reset",
          ...data,
          token: token,
        });
      } else {
        const user = await db.User.findOne({
          where: {
            resetToken: token,
            resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() },
          },
        });
        if (user) {
          let hashedPassword = await bcrypt.hash(request.body.password, 8);
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiry = null;
          await user.save();
          return response.redirect("/login");
        } else {
          return response.render(path.resolve("views/auth/reset-password"), {
            title: "Password Reset",
            token: token,
            error: message("token-expired"),
          });
        }
      }
    } catch (error) {
      return response.render(path.resolve("views/auth/reset-password"), {
        title: "Password Reset",
        token: token,
        error: error.message,
      });
    }
  }

  /**----- user logout functionality -----**/
  static async logout(request, response) {
    request.session.destroy((err) => {
      if (err) {
        response.redirect(req.headers.referer);
      } else {
        response.redirect("/");
      }
    });
  }
}
