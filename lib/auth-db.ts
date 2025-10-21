// Authentication database operations
import { createPool } from './db-config';
import type { LoginCredentials, AuthResponse, UsuarioDB } from './types-auth';
import { hashPassword, verifyPassword, generateSalt } from './auth-utils';
import type { Usuario } from './types';

// Function to authenticate user
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // For testing purposes, check if it's the test user
    if (credentials.email === "teste@teste.com" && credentials.password === "123") {
      return {
        success: true,
        message: 'Login bem-sucedido',
        user: {
          id: 'test-user-id',
          nome: 'Test User',
          email: 'teste@teste.com',
          perfil: 'admin',
          avatar_url: undefined,
          created_at: new Date(),
          updated_at: new Date(),
        } as UsuarioDB
      };
    }
    
    // For non-test users, try to authenticate from database
    const pool = createPool();
    try {
      // Query users table to find the user by email
      const result = await pool.query(
        'SELECT id, nome, email, perfil, avatar_url, created_at, updated_at, password_hash, salt, last_login, is_active FROM usuarios WHERE email = $1',
        [credentials.email]
      );
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }
      
      const user = result.rows[0];
      
      if (!user.is_active) {
        return {
          success: false,
          message: 'Conta desativada'
        };
      }
      
      // Verify the password
      const isValidPassword = verifyPassword(credentials.password, user.password_hash, user.salt);
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Senha incorreta'
        };
      }
      
      // Update last login
      await pool.query(
        'UPDATE usuarios SET last_login = NOW() WHERE id = $1',
        [user.id]
      );
      
      // Remove sensitive data before returning
      const { password_hash, salt, ...userWithoutPassword } = user;
      
      return {
        success: true,
        message: 'Login bem-sucedido',
        user: userWithoutPassword as UsuarioDB
      };
      
    } catch (error) {
      console.error('Erro durante autenticação:', error);
      // If there's a database error (like connection error), still allow test user to log in
      if (credentials.email === "teste@teste.com" && credentials.password === "123") {
        return {
          success: true,
          message: 'Login bem-sucedido',
          user: {
            id: 'test-user-id',
            nome: 'Test User',
            email: 'teste@teste.com',
            perfil: 'admin',
            avatar_url: undefined,
            created_at: new Date(),
            updated_at: new Date(),
          } as UsuarioDB
        };
      }
      return {
        success: false,
        message: 'Erro durante o login'
      };
    } finally {
      await pool.end();
    }
  } catch (error) {
    console.error('Erro durante autenticação:', error);
    return {
      success: false,
      message: 'Erro durante o login'
    };
  }
}

// Function to create a user with password
export async function createUserWithPassword(userData: Omit<Usuario, 'id' | 'criado_em' | 'atualizado_em'> & { password: string }): Promise<UsuarioDB | null> {
  const pool = createPool();
  try {
    const { password, ...userWithoutPassword } = userData;
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    
    const result = await pool.query(
      `INSERT INTO usuarios (
        id, nome, email, perfil, avatar_url, created_at, updated_at, password_hash, salt, is_active
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW(), $5, $6, true
      ) RETURNING id, nome, email, perfil, avatar_url, created_at, updated_at`,
      [
        userWithoutPassword.nome, 
        userWithoutPassword.email, 
        userWithoutPassword.perfil || 'vendedor',
        userWithoutPassword.avatar_url,
        passwordHash,
        salt
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return null;
  } finally {
    await pool.end();
  }
}

// Function to add password fields to existing users table
export async function setupAuthForUsers(): Promise<void> {
  const pool = createPool();
  try {
    // Add password-related columns to the usuarios table if they don't exist
    await pool.query(`
      DO $$ 
      BEGIN
        -- Add password_hash column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'password_hash') THEN
          ALTER TABLE usuarios ADD COLUMN password_hash TEXT;
        END IF;
        
        -- Add salt column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'salt') THEN
          ALTER TABLE usuarios ADD COLUMN salt TEXT;
        END IF;
        
        -- Add last_login column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'last_login') THEN
          ALTER TABLE usuarios ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add is_active column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'is_active') THEN
          ALTER TABLE usuarios ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);
  } finally {
    await pool.end();
  }
}