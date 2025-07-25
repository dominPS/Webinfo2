import { api } from '@/services/authServices';
import { UserSchema, type User } from '@/schemas/user';
import axios from 'axios';
import { eventPath } from '@/routes/eventPath';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


export const getUser = async (): Promise<User> => {
  try {
      const response = await api.get(eventPath.user.path);
    return UserSchema.parse(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.message, error.response?.status);
    }
    if (error instanceof Error) {
      throw new ApiError(error.message);
    }
    throw new ApiError('Nieznany błąd');
  }
};