import message from "./message";

export default (io) => {
    io.on('connection', async socket => {
        socket.on('send:notification', message => {
            socket.broadcast.emit('notification', message);
        });
    });
    return io;
}