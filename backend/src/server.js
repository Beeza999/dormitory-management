const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const { Server } = require('socket.io');
const registerChatSocket = require('./sockets/chat.socket');

async function bootstrap() {
  try {
    await connectDB();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*'
      }
    });

    registerChatSocket(io);

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('DB connection error:', error.message);
    process.exit(1);
  }
}

bootstrap();
