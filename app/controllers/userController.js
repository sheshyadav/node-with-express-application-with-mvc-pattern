import path from "path";
import db from "../models/index.js";

export default class UserController {
  /**----- welcome page view -----**/
  static async dashboard(request, response) {
    try {
      if (!request.session.user) {
        return response.redirect("/login");
      }

      const user = await db.User.findByPk(request.session.user.id);
      if (!user) {
        request.session.destroy();
        return response.redirect("/login");
      } else {
        return response.render(path.resolve("views/user/home"), {
          title: "Home",
          user: user.toJSON(),
        });
      }
    } catch (error) {
      return response.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
      });
    }
  }

  /**----- user profile page view -----**/
  static async profile(request, response) {
    try {
      if (!request.session.user) {
        return response.redirect("/login");
      }

      const user = await db.User.findByPk(request.session.user.id);
      if (!user) {
        request.session.destroy();
        return response.redirect("/login");
      } else {
        return response.render(path.resolve("views/user/profile"), {
          title: "Profile",
          user: user.toJSON(),
        });
      }
    } catch (error) {
      return response.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
      });
    }
  }
}
