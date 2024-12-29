import path from "path";
import db from "../models/index.js";

export default class AdminController {
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
        return response.render(path.resolve("views/admin/home"), {
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

  /**----- admin profile page view -----**/
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
        return response.render(path.resolve("views/admin/profile"), {
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
