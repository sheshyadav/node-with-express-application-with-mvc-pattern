import session from "express-session";
import FileStore from "session-file-store";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import 'dotenv/config';

const fileStore = FileStore(session);

export default session({
  genid: (req) => {
    return uuidv4();
  },
  store: new fileStore({
    path: path.resolve("storage/session/"),
    reapInterval: 60,
    logFn: function () {},
  }),
  name: "chatapp",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: Number(process.env.COOKIE_EXPIRESIN),
    sameSite:true,
    priority:'high',
  },
});

