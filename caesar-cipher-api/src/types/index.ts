import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser {
  username: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Cipher ──────────────────────────────────────────────────────────────────

export interface ICipher {
  hash: string;
  step: number;
  used: boolean;
  userId: Types.ObjectId;
  expiresAt: Date;
}

export interface ICipherDocument extends ICipher, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface EncryptRequestBody {
  message: string;
  step: number;
}

export interface DecryptRequestBody {
  encryptedMessage: string;
  hash: string;
}

export interface RegisterRequestBody {
  username: string;
  password: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface EncryptResponse {
  hash: string;
  encryptedMessage: string;
}

export interface DecryptResponse {
  originalMessage: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}
