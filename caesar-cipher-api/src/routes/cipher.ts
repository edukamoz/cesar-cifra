import { Router, Response } from 'express';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { Cipher } from '../models/Cipher';
import { authMiddleware } from '../middlewares/auth';
import {
  encrypt as caesarEncrypt,
  decrypt as caesarDecrypt,
} from '../services/caesarCipher';
import {
  AuthenticatedRequest,
  EncryptRequestBody,
  DecryptRequestBody,
  ApiResponse,
  EncryptResponse,
  DecryptResponse,
  ICipherDocument
} from '../types';

const router = Router();

// Todas as rotas de cifra exigem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Cipher
 *   description: Cifragem e Decifragem de Mensagens
 */

/**
 * @swagger
 * /api/cipher/encrypt:
 *   post:
 *     summary: Cifra uma mensagem e salva o hash
 *     tags: [Cipher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - step
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Minha mensagem secreta!"
 *               step:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Mensagem cifrada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       401:
 *         description: Não autorizado (Token ausente ou inválido).
 */
router.post(
  '/encrypt',
  [
    body('message').trim().notEmpty().withMessage('A mensagem é obrigatória e não pode estar vazia.').escape(),
    body('step').isInt().withMessage('O passo (step) é obrigatório e deve ser um número inteiro.'),
  ],
  async (
    req: AuthenticatedRequest & { body: EncryptRequestBody },
    res: Response<ApiResponse<EncryptResponse | null>>
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
        return;
      }

      const { message, step } = req.body;

      const encryptedMessage = caesarEncrypt(message, step);

      const hashInput = `${message}:${step}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
      const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

      // Define expiração para 24h a partir de agora
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await Cipher.create({
        hash,
        step,
        used: false,
        userId: req.user!.userId,
        expiresAt,
      });

      res.status(201).json({
        success: true,
        message: 'Mensagem cifrada com sucesso.',
        data: {
          hash,
          encryptedMessage,
        },
      });
    } catch (error) {
      console.error('Erro ao cifrar:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao cifrar a mensagem.',
      });
    }
  }
);

/**
 * @swagger
 * /api/cipher/decrypt:
 *   post:
 *     summary: Decifra uma mensagem utilizando o hash
 *     tags: [Cipher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - encryptedMessage
 *               - hash
 *             properties:
 *               encryptedMessage:
 *                 type: string
 *               hash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensagem decifrada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Hash já utilizado.
 *       404:
 *         description: Hash não encontrado ou expirado.
 */
router.post(
  '/decrypt',
  [
    body('encryptedMessage').trim().notEmpty().withMessage('A mensagem cifrada é obrigatória.').escape(),
    body('hash').trim().notEmpty().withMessage('O hash é obrigatório.').escape(),
  ],
  async (
    req: AuthenticatedRequest & { body: DecryptRequestBody },
    res: Response<ApiResponse<DecryptResponse | null>>
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
        return;
      }

      const { encryptedMessage, hash } = req.body;

      const cipherRecord = await Cipher.findOne({ hash });

      if (!cipherRecord) {
        res.status(404).json({
          success: false,
          message: 'Hash não encontrado ou já expirado. Chave inválida.',
        });
        return;
      }

      if (cipherRecord.used) {
        res.status(403).json({
          success: false,
          message: 'Este hash já foi utilizado. Decifração negada.',
        });
        return;
      }

      const originalMessage = caesarDecrypt(encryptedMessage, cipherRecord.step);

      await Cipher.findByIdAndUpdate(cipherRecord._id, { used: true });

      res.status(200).json({
        success: true,
        message: 'Mensagem decifrada com sucesso.',
        data: {
          originalMessage,
        },
      });
    } catch (error) {
      console.error('Erro ao decifrar:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao decifrar a mensagem.',
      });
    }
  }
);

/**
 * @swagger
 * /api/cipher/history:
 *   get:
 *     summary: Retorna o histórico de hashes do usuário autenticado
 *     tags: [Cipher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico recuperado com sucesso.
 *       401:
 *         description: Não autorizado.
 */
router.get(
  '/history',
  async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ICipherDocument[]>>
  ): Promise<void> => {
    try {
      // Busca os ciphers do usuário, ordenados do mais recente pro mais antigo
      const history = await Cipher.find({ userId: req.user!.userId }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: 'Histórico recuperado com sucesso.',
        data: history,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao buscar histórico.',
      });
    }
  }
);

export default router;
