import * as SQLite from 'expo-sqlite';

// 1. Abre o banco de dados usando a NOVA função
const db = SQLite.openDatabaseSync('samu.db');

// 2. Inicializa a tabela
export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT
      );
    `);
    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao iniciar DB:", error);
  }
};

// 3. Função de Cadastro (Síncrona)
export const registerUser = (email: string, password: string, name: string) => {
  try {
    // Verifica se já existe
    const existing = db.getAllSync('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return { success: false, message: 'E-mail já cadastrado!' };
    }

    const result = db.runSync(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, password, name]
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    return { success: false, message: 'Erro ao cadastrar (verifique os dados).' };
  }
};

// 4. Função de Login (Síncrona)
export const loginUser = (email: string, password: string) => {
  try {
    const user = db.getFirstSync('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    
    if (user) {
      return { success: true, user };
    }
    return { success: false, message: 'Email ou senha incorretos.' };
  } catch (error) {
    return { success: false, message: 'Erro ao tentar logar.' };
  }
};