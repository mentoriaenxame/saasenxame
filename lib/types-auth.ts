// Types for authentication
import type { UsuarioDB } from './types-db';

export interface UsuarioAuthDB extends UsuarioDB {
  password_hash: string;
  salt: string;
  last_login?: Date;
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UsuarioDB;
  token?: string;
}