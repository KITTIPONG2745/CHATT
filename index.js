const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // อนุญาตให้ทุก domain ใช้งานได้
    }
});

// ให้ Express เสิร์ฟไฟล์ static รวมถึง `index.html`
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// เมื่อมี client เชื่อมต่อ
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // ส่งข้อความไปให้ทุก client
    });
});

// ใช้ PORT จาก Render.com หรือใช้ 3000 ถ้าไม่มีค่า
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
