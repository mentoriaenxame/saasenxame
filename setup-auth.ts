// Script to setup authentication and create test user
import { setupAuthForUsers, createUserWithPassword } from './lib/auth-db';

async function setupAuthAndTestUser() {
  console.log("Configurando autenticação no banco de dados...");
  await setupAuthForUsers();
  console.log("Autenticação configurada com sucesso!");

  console.log("Criando usuário de teste...");
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
}

setupAuthAndTestUser().catch(console.error);