import { Request, Response } from 'express';
import prisma from '../config/database';

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const room = await prisma.room.create({
      data: {
        name: name || `Room ${Date.now()}`,
        description,
        creatorId: req.user.id
      },
      include: {
        creator: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    // Add creator as participant
    await prisma.roomParticipant.create({
      data: {
        userId: req.user.id,
        roomId: room.id
      }
    });

    res.status(201).json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomHistory = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        creator: true,
        participants: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: {
        roomId: roomId
      },
      include: {
        sender: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
