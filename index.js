"use strict";

import express from "express";
import engine from "ejs-locals";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";

import guestRoute from "./routes/guest-route.js";
import userRoute from "./routes/user-route.js";
import adminRoute from "./routes/admin-route.js";
import setHelper from "./app/helpers/index.js";
import errorHandler from "./app/services/errorHandler.js";
import logger from "./app/services/logger.js";
import { auth, adminAccess, userAccess, verified} 
from "./app/middlewares/authentication.js";
import session from "./config/session.js";
import doubleCsrf from "./config/csrf.js";
const { generateToken } = doubleCsrf;

/**----- setup the server -----**/
const app = express();
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/**----- application session setup section -----**/
app.use(session);
app.use(cookieParser());
/**----- application session setup section -----**/


/**----- application global variable setup section -----**/
app.use((req, res, next) => {
app.locals['csrfToken'] = generateToken(req, res);
next();
});
/**----- application global variable setup section -----**/


/**----- application log manage section -----**/
app.use(morgan('combined', {
stream: {write:(message) => logger.info(message.trim())}
}));
/**----- application log manage section -----**/


/**----- routes configuration section -----**/
app.use("/admin", auth, adminAccess, verified, adminRoute);
app.use("/user", auth, userAccess, verified, userRoute);
app.use(guestRoute);
app.use(errorHandler);
setHelper(app);
/**----- routes configuration section -----**/


/**----- application start the server -----**/
app.listen(
  process.env.APP_PORT,
  console.log(`Application Server started on url ${process.env.APP_URL}`)
);
/**----- application start the server -----**/
