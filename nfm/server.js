const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Өрөөнүүдийн мэдээллийг хадгалах объект
const rooms = {};

io.on('connection', (socket) => {
    console.log('Хэрэглэгч холбогдлоо:', socket.id);

    // Өрөө үүсгэх эсвэл орох
    socket.on('joinRoom', ({ roomCode, username }) => {
        socket.join(roomCode);

        if (!rooms[roomCode]) {
            rooms[roomCode] = { players: [] };
        }

        // Дээд тал нь 4 хүн авна
        if (rooms[roomCode].players.length >= 4) {
            socket.emit('errorMsg', 'Өрөө дүүрсэн байна!');
            return;
        }

        const player = { id: socket.id, username };
        rooms[roomCode].players.push(player);

        io.to(roomCode).emit('roomUpdated', rooms[roomCode]);
        console.log(`${username} [${roomCode}] өрөөнд орлоо.`);
    });

    // Хөзөр хаях эвент
    socket.on('playCard', ({ roomCode, card }) => {
        // Хяналт болон тоглоомын логикийг энд өргөжүүлж болно
        io.to(roomCode).emit('cardPlayed', {
            playerId: socket.id,
            card: card
        });
    });

    // Холболт тасрах
    socket.on('disconnect', () => {
        console.log('Хэрэглэгч саллаа:', socket.id);
        for (const code in rooms) {
            rooms[code].players = rooms[code].players.filter(p => p.id !== socket.id);
            io.to(code).emit('roomUpdated', rooms[code]);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна.`);
});