// Script to create a test user for login
import { createUserWithPassword } from './lib/auth-db';

async function createTestUser() {
  try {
    const testUser = await createUserWithPassword({
      nome: "Test User",
      email: "teste@teste.com",
      perfil: "admin",
      password: "123"
    });

    if (testUser) {
      console.log("Usuário de teste criado com sucesso!");
      console.log("Email: teste@teste.com");
      console.log("Senha: 123");
    } else {
      console.log("Erro ao criar usuário de teste");
    }
  } catch (error) {
    console.error("Erro ao criar usuário de teste:", error);
  }
}

createTestUser();