import path from "path";

export default function errorHandler(error, req, res, next) {
    res.render(path.resolve("views/errors/500"), {
        title: "Server Error",
        error: error.message,
    });
}