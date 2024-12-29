import * as helpers from "./helpers.js";
export default function setHelper(app){
    Object.entries({...helpers}).forEach(([key, value])=>{
        app.locals[key] = value;
    })
}