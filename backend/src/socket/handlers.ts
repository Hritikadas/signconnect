import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

interface UserSocket extends Socket {
  userId?: string;
  userName?: string;
}

export const setupSocketHandlers = (io: Server) => {
  io.use((socket: UserSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: UserSocket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on('join-room', async ({ roomId, userId, userName }) => {
      socket.join(roomId);
      socket.userName = userName;
      
      socket.to(roomId).emit('user-joined', { userId, userName });

      try {
        // Find or create room
        let room = await prisma.room.findUnique({ where: { id: roomId } });
        
        if (!room) {
          room = await prisma.room.create({
            data: {
              id: roomId,
              name: `Room ${roomId}`,
              creatorId: userId
            }
          });
        }

        // Add user as participant if not already
        const existingParticipant = await prisma.roomParticipant.findUnique({
          where: {
            userId_roomId: {
              userId: userId,
              roomId: roomId
            }
          }
        });

        if (!existingParticipant) {
          await prisma.roomParticipant.create({
            data: {
              userId: userId,
              roomId: roomId
            }
          });
        }
      } catch (error) {
        console.error('Error updating room:', error);
      }
    });

    socket.on('offer', ({ offer, to, roomId }) => {
      socket.to(to).emit('offer', {
        offer,
        userId: socket.userId,
        userName: socket.userName
      });
    });

    socket.on('answer', ({ answer, to, roomId }) => {
      socket.to(to).emit('answer', {
        answer,
        userId: socket.userId
      });
    });

    socket.on('ice-candidate', ({ candidate, to, roomId }) => {
      socket.to(to).emit('ice-candidate', {
        candidate,
        userId: socket.userId
      });
    });

    socket.on('chat-message', async ({ roomId, message }) => {
      socket.to(roomId).emit('chat-message', message);

      try {
        await prisma.message.create({
          data: {
            content: message.text,
            type: message.isSign ? 'SIGN_TRANSLATION' : 'TEXT',
            senderId: message.userId,
            roomId: roomId
          }
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('sign-detected', async ({ roomId, text, userId }) => {
      io.to(roomId).emit('sign-detected', {
        text,
        userId,
        userName: socket.userName
      });

      try {
        await prisma.message.create({
          data: {
            content: text,
            type: 'SIGN_TRANSLATION',
            senderId: userId,
            roomId: roomId
          }
        });

        // Also save sign detection data
        await prisma.signDetection.create({
          data: {
            userId: userId,
            roomId: roomId,
            signData: JSON.stringify({ text }),
            translation: text,
            confidence: 0.8 // Default confidence
          }
        });
      } catch (error) {
        console.error('Error saving sign message:', error);
      }
    });

    socket.on('leave-room', ({ roomId }) => {
      socket.to(roomId).emit('user-left', { userId: socket.userId });
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
