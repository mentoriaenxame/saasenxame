// Script para testar as operações do banco de dados
import { config } from 'dotenv';
import { 
  getAllClientes,
  createCliente,
  getAllUsuarios,
  createUsuario
} from './lib/db-operations-actions';

// Carregar variáveis de ambiente
config({ path: './.env.local' });

async function runDbOperationsTest() {
  console.log('Iniciando teste de operações do banco de dados...');
  
  try {
    // Testar leitura de dados
    console.log('1. Testando leitura de clientes...');
    const clientes = await getAllClientes();
    console.log(`   ✓ ${clientes.length} clientes encontrados`);
    
    // Testar leitura de usuários
    console.log('2. Testando leitura de usuários...');
    const usuarios = await getAllUsuarios();
    console.log(`   ✓ ${usuarios.length} usuários encontrados`);
    
    // Testar criação de cliente primeiro (não depende de email único)
    console.log('3. Testando criação de cliente...');
    const novoCliente = await createCliente({
      nome: `Cliente de Teste ${Date.now()}`,
      email: `cliente${Date.now()}@teste.com`,
      telefone: '(00) 00000-0000',
      empresa: 'Empresa de Teste',
      cargo: 'Cargo Teste',
      status: 'lead',
      fonte: 'teste_sistema',
      data_registro: new Date(),
      tags: ['teste', 'sistema']
    });
    console.log(`   ✓ Cliente criado com ID: ${novoCliente.id}`);
    
    // Testar criação de um usuário
    console.log('4. Testando criação de usuário...');
    const novoUsuario = await createUsuario({
      nome: `Teste Sistema ${Date.now()}`,
      email: `teste${Date.now()}@crm.local`,
      perfil: 'vendedor'
    });
    console.log(`   ✓ Usuário criado com ID: ${novoUsuario.id}`);
    
    console.log('\n✓ Todos os testes de operações do banco de dados passaram com sucesso!');
  } catch (error) {
    console.error('✗ Erro durante os testes de operações do banco de dados:', error);
    process.exit(1);
  }
}

// Executar o teste
runDbOperationsTest();