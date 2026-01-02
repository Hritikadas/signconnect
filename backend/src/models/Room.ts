import { Room, Message, RoomParticipant, Prisma } from '@prisma/client';

export type IRoom = Room;
export type IMessage = Message;
export type IRoomParticipant = RoomParticipant;

export type CreateRoomInput = Prisma.RoomCreateInput;
export type UpdateRoomInput = Prisma.RoomUpdateInput;
export type RoomWhereInput = Prisma.RoomWhereInput;

// Room with relations
export type RoomWithRelations = Prisma.RoomGetPayload<{
  include: {
    creator: true;
    participants: {
      include: {
        user: true;
      };
    };
    messages: {
      include: {
        sender: true;
      };
    };
  };
}>;

// Message with relations
export type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: true;
  };
}>;

// Export types for use in controllers
export { Room, Message, RoomParticipant } from '@prisma/client';