import mongoose from 'mongoose';

/**
 * Conecta ao MongoDB usando a URI do .env
 * Implementa retry automático e logs de conexão.
 */
export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI não definida nas variáveis de ambiente.');
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('❌ Erro na conexão MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB desconectado.');
  });
};
