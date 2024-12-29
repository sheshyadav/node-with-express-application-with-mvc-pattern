import {io} from "../../config/server.js";

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(token){
        socket.id = token;
        console.log('Token verified successfully:', token);
        return next();
    }
    return next(new Error('Authentication error!')); // Deny the connection
  });


io.on("connection", (socket) => {
    console.log("User connected ID:", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected ID:", socket.id);
    });
});
  