import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export type IUser = User;

export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;

// User with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    sentMessages: true;
    roomParticipants: {
      include: {
        room: true;
      };
    };
    createdRooms: true;
  };
}>;

// Utility functions for password handling
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Export types for use in controllers
export { User } from '@prisma/client';