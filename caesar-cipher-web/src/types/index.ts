/* ─── Auth ─────────────────────────────────────────────────────────────── */

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/* ─── Cipher ───────────────────────────────────────────────────────────── */

export interface EncryptResponse {
  hash: string;
  encryptedMessage: string;
}

export interface DecryptResponse {
  originalMessage: string;
}

export interface ICipherDocument {
  _id: string;
  hash: string;
  step: number;
  used: boolean;
  expiresAt: string;
  createdAt: string;
}

/* ─── User ─────────────────────────────────────────────────────────────── */

export interface User {
  id: string;
  username: string;
}
