import 'dotenv/config';
import { doubleCsrf } from "csrf-csrf";

const doubleCsrfUtilities = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET,
  cookieName: "x-csrf-token",
  cookieOptions: {
    sameSite: "lax", 
    path: "/",
    secure: true,
  },
  size: 64, 
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.body._token, 
});

export default doubleCsrfUtilities;


