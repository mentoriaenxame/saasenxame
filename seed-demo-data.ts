// Script para inserir dados de demonstração no banco de dados

import { createCliente } from './lib/db-operations-actions';

async function seedDemoData() {
  console.log('Iniciando inserção de dados de demonstração...');
  
  try {
    // Inserir clientes de demonstração
    await createCliente({
      nome: 'Maria Silva',
      empresa: 'Tech Solutions Ltda',
      email: 'maria.silva@techsolutions.com',
      telefone: '(11) 99999-8888',
      cargo: 'Diretora',
      status: 'cliente',
      historico_compras: 'R$ 15.000,00',
      preferencias_comunicacao: ['email', 'whatsapp'],
      fonte: 'website',
      tags: ['importante', 'contrato'],
      data_registro: new Date()
    });
    
    await createCliente({
      nome: 'João Oliveira',
      empresa: 'Marketing Pro',
      email: 'joao.oliveira@marketingpro.com',
      telefone: '(21) 98888-7777',
      cargo: 'CEO',
      status: 'negociacao',
      historico_compras: 'R$ 8.500,00',
      preferencias_comunicacao: ['ligacao', 'email'],
      fonte: 'indicacao',
      tags: ['lead-quento'],
      data_registro: new Date()
    });
    
    await createCliente({
      nome: 'Ana Costa',
      empresa: 'Design Studio',
      email: 'ana.costa@designstudio.com',
      telefone: '(31) 97777-6666',
      cargo: 'Diretora Criativa',
      status: 'lead',
      historico_compras: 'R$ 3.200,00',
      preferencias_comunicacao: ['email'],
      fonte: 'midia-social',
      tags: ['potencial'],
      data_registro: new Date()
    });
    
    console.log('✓ Dados de demonstração inseridos com sucesso!');
  } catch (error) {
    console.error('✗ Erro ao inserir dados de demonstração:', error);
  }
}

// Executar o script
seedDemoData();