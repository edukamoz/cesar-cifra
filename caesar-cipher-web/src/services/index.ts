import api from './api';
import type { ApiResponse, AuthResponse, EncryptResponse, DecryptResponse } from '../types';

/* ─── Auth ─────────────────────────────────────────────────────────────── */

export const authService = {
  async register(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      username,
      password,
    });
    return data;
  },

  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      username,
      password,
    });
    return data;
  },
};

/* ─── Cipher ───────────────────────────────────────────────────────────── */

export const cipherService = {
  async encrypt(message: string, step: number): Promise<ApiResponse<EncryptResponse>> {
    const { data } = await api.post<ApiResponse<EncryptResponse>>('/cipher/encrypt', {
      message,
      step,
    });
    return data;
  },

  async decrypt(encryptedMessage: string, hash: string): Promise<ApiResponse<DecryptResponse>> {
    const { data } = await api.post<ApiResponse<DecryptResponse>>('/cipher/decrypt', {
      encryptedMessage,
      hash,
    });
    return data;
  },

  async history(): Promise<ApiResponse<import('../types').ICipherDocument[]>> {
    const { data } = await api.get<ApiResponse<import('../types').ICipherDocument[]>>('/cipher/history');
    return data;
  },
};
