import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import {
  RegisterRequestBody,
  LoginRequestBody,
  ApiResponse,
  AuthResponse,
} from '../types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação de Usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "eduardo"
 *               password:
 *                 type: string
 *                 example: "minhasenha123"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       400:
 *         description: Erro de validação dos dados.
 *       409:
 *         description: Username já em uso.
 */
router.post(
  '/register',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username é obrigatório.')
      .isLength({ min: 3, max: 30 }).withMessage('Username deve ter entre 3 e 30 caracteres.')
      .escape(), // Basic sanitization
    body('password')
      .notEmpty().withMessage('Password é obrigatória.')
      .isLength({ min: 6 }).withMessage('Password deve ter no mínimo 6 caracteres.'),
  ],
  async (
    req: Request<object, ApiResponse<AuthResponse | null>, RegisterRequestBody>,
    res: Response<ApiResponse<AuthResponse | null>>
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: errors.array()[0].msg, // Retorna a primeira mensagem de erro
        });
        return;
      }

      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'Username já está em uso.',
        });
        return;
      }

      const user = await User.create({ username, password });

      const token = jwt.sign(
        { userId: user._id.toString(), username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
      );

      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso.',
        data: {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
          },
        },
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao registrar usuário.',
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna um JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "eduardo"
 *               password:
 *                 type: string
 *                 example: "minhasenha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username é obrigatório.').escape(),
    body('password').notEmpty().withMessage('Password é obrigatória.'),
  ],
  async (
    req: Request<object, ApiResponse<AuthResponse | null>, LoginRequestBody>,
    res: Response<ApiResponse<AuthResponse | null>>
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

      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas.',
        });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas.',
        });
        return;
      }

      const token = jwt.sign(
        { userId: user._id.toString(), username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
      );

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso.',
        data: {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
          },
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao realizar login.',
      });
    }
  }
);

export default router;
