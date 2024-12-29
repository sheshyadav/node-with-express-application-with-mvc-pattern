import { resolve } from "path";
import fs from "fs";

try {
  const path = resolve("storage/session");
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path + "/" + file;
      fs.unlinkSync(curPath);
    });
    console.log("session clear success."); 
  }else { console.log("path not found."); }
} catch (error) {
  console.log(error.message);
}
