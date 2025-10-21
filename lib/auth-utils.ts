// Authentication utilities
import { createHash } from 'crypto';

// Hash a password (using SHA-256 with a simple salt approach)
export function hashPassword(password: string, salt: string = ''): string {
  return createHash('sha256').update(password + salt).digest('hex');
}

// Compare password with hash
export function verifyPassword(password: string, hash: string, salt: string = ''): boolean {
  const computedHash = hashPassword(password, salt);
  return computedHash === hash;
}

// Generate a random salt
export function generateSalt(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}