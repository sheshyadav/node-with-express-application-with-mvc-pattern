import db from "../models/index.js";

export function guest(request, response, next) {
  if (request.session.user) {
    return response.redirect(301, "/");
  }
  next();
}

export async function auth(request, response, next) {
  if (!request.session.user) {
    return response.redirect(301, "/login");
  } else if (request.session.user) {
    const user = await db.User.findByPk(request.session.user.id);
    if (!user) {
      request.session.destroy();
      return response.redirect(301, "/login");
    }
  }
  next();
}

export function adminAccess(request, response, next) {
  if (request.session.user && request.session.user.role != 0) {
    return response.redirect(301, "/403");
  }
  next();
}

export function userAccess(request, response, next) {
  if (request.session.user && request.session.user.role != 1) {
    return response.redirect(301, "/403");
  }
  next();
}

export async function verified(request, response, next) {
  if (request.session.user) {
    const status = await db.User.findByPk(request.session.user.id);
    if (!status.verifiedAt) {
      return response.redirect(301, "/verify");
    }
  }
  next();
}
