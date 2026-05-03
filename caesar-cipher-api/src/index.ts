import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/auth';
import cipherRoutes from './routes/cipher';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globais ─────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rotas ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/cipher', cipherRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Caesar Cipher está online.',
    timestamp: new Date().toISOString(),
  });
});



// ─── Bootstrap ───────────────────────────────────────────────────────────────

const startServer = async (): Promise<void> => {
  await connectDatabase();

  setupSwagger(app);

  // ─── Rota 404 (deve ser a última) ───────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Rota não encontrada.',
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/cipher/encrypt   (autenticado)`);
    console.log(`   POST /api/cipher/decrypt   (autenticado)`);
    console.log(`   GET  /api/health`);
  });
};

startServer().catch((err) => {
  console.error('❌ Falha ao iniciar o servidor:', err);
  process.exit(1);
});
