// Operações de banco de dados para o CRM System
import { createPool } from './db-config';
import type {
  ClienteDB,
  AtividadeDB,
  TarefaDB,
  EventoDB,
  UsuarioDB,
  CreateClienteData,
  UpdateClienteData,
  CreateAtividadeData,
  UpdateAtividadeData,
  CreateTarefaData,
  UpdateTarefaData,
  CreateEventoData,
  UpdateEventoData,
  CreateUsuarioData,
  UpdateUsuarioData
} from './types-db';

// Funções para clientes
export async function getAllClientes(): Promise<ClienteDB[]> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM clientes ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}

export async function getClienteById(id: string): Promise<ClienteDB | null> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function createCliente(data: CreateClienteData): Promise<ClienteDB> {
  const {
    nome,
    email,
    telefone,
    empresa,
    cargo,
    status,
    historico_compras,
    preferencias_comunicacao,
    fonte,
    data_registro,
    tags
  } = data;

  const pool = createPool();
  try {
    const result = await pool.query(
      `INSERT INTO clientes (
        id, nome, email, telefone, empresa, cargo, status,
        historico_compras, preferencias_comunicacao, fonte, data_registro, tags,
        created_at, updated_at
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`,
      [
        nome, email, telefone, empresa, cargo, status,
        historico_compras, preferencias_comunicacao, fonte,
        data_registro || new Date(), tags || []
      ]
    );
    return result.rows[0];
  } finally {
    await pool.end();
  }
}

export async function updateCliente(id: string, data: UpdateClienteData): Promise<ClienteDB | null> {
  const pool = createPool();
  try {
    // Construir dinamicamente a query com base nos campos fornecidos
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      // Nenhuma atualização fornecida
      return await getClienteById(id);
    }

    // Adicionar updated_at
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE clientes SET ${fields.join(', ')} WHERE id = ${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function deleteCliente(id: string): Promise<boolean> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'DELETE FROM clientes WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    await pool.end();
  }
}

// Funções para atividades
export async function getAllAtividades(): Promise<AtividadeDB[]> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM atividades ORDER BY data DESC'
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}

export async function getAtividadeById(id: string): Promise<AtividadeDB | null> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM atividades WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function createAtividade(data: CreateAtividadeData): Promise<AtividadeDB> {
  const { cliente_id, tipo, descricao, data: dataAtividade, usuario_id, concluida } = data;

  const pool = createPool();
  try {
    const result = await pool.query(
      `INSERT INTO atividades (
        id, cliente_id, tipo, descricao, data, usuario_id, concluida, created_at
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
      [cliente_id, tipo, descricao, dataAtividade, usuario_id, concluida]
    );
    return result.rows[0];
  } finally {
    await pool.end();
  }
}

export async function updateAtividade(id: string, data: UpdateAtividadeData): Promise<AtividadeDB | null> {
  const pool = createPool();
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await getAtividadeById(id);
    }

    values.push(id);
    const query = `UPDATE atividades SET ${fields.join(', ')} WHERE id = ${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function deleteAtividade(id: string): Promise<boolean> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'DELETE FROM atividades WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    await pool.end();
  }
}

// Funções para tarefas
export async function getAllTarefas(): Promise<TarefaDB[]> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM tarefas ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}

export async function getTarefaById(id: string): Promise<TarefaDB | null> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function createTarefa(data: CreateTarefaData): Promise<TarefaDB> {
  const { titulo, descricao, status, prioridade, data_vencimento, cliente_id, usuario_id } = data;

  const pool = createPool();
  try {
    const result = await pool.query(
      `INSERT INTO tarefas (
        id, titulo, descricao, status, prioridade, data_vencimento, cliente_id, usuario_id, created_at, updated_at
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [titulo, descricao, status, prioridade, data_vencimento, cliente_id, usuario_id]
    );
    return result.rows[0];
  } finally {
    await pool.end();
  }
}

export async function updateTarefa(id: string, data: UpdateTarefaData): Promise<TarefaDB | null> {
  const pool = createPool();
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await getTarefaById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);
    const query = `UPDATE tarefas SET ${fields.join(', ')} WHERE id = ${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function deleteTarefa(id: string): Promise<boolean> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'DELETE FROM tarefas WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    await pool.end();
  }
}

// Funções para eventos
export async function getAllEventos(): Promise<EventoDB[]> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM eventos ORDER BY data_inicio DESC'
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}

export async function getEventoById(id: string): Promise<EventoDB | null> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM eventos WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function createEvento(data: CreateEventoData): Promise<EventoDB> {
  const { titulo, descricao, data_inicio, data_fim, localizacao, cliente_id, usuario_id } = data;

  const pool = createPool();
  try {
    const result = await pool.query(
      `INSERT INTO eventos (
        id, titulo, descricao, data_inicio, data_fim, localizacao, cliente_id, usuario_id, created_at, updated_at
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [titulo, descricao, data_inicio, data_fim, localizacao, cliente_id, usuario_id]
    );
    return result.rows[0];
  } finally {
    await pool.end();
  }
}

export async function updateEvento(id: string, data: UpdateEventoData): Promise<EventoDB | null> {
  const pool = createPool();
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await getEventoById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);
    const query = `UPDATE eventos SET ${fields.join(', ')} WHERE id = ${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function deleteEvento(id: string): Promise<boolean> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'DELETE FROM eventos WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    await pool.end();
  }
}

// Funções para usuários
export async function getAllUsuarios(): Promise<UsuarioDB[]> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}

export async function getUsuarioById(id: string): Promise<UsuarioDB | null> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function createUsuario(data: CreateUsuarioData): Promise<UsuarioDB> {
  const { nome, email, perfil } = data;

  const pool = createPool();
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (
        id, nome, email, perfil, created_at, updated_at
      ) VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
      RETURNING *`,
      [nome, email, perfil]
    );
    return result.rows[0];
  } finally {
    await pool.end();
  }
}

export async function updateUsuario(id: string, data: UpdateUsuarioData): Promise<UsuarioDB | null> {
  const pool = createPool();
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await getUsuarioById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);
    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

export async function deleteUsuario(id: string): Promise<boolean> {
  const pool = createPool();
  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    await pool.end();
  }
}