import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDocument } from '../types';

const UserSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username é obrigatório.'],
      unique: true,
      trim: true,
      minlength: [3, 'Username deve ter no mínimo 3 caracteres.'],
      maxlength: [30, 'Username deve ter no máximo 30 caracteres.'],
    },
    password: {
      type: String,
      required: [true, 'Password é obrigatória.'],
      minlength: [6, 'Password deve ter no mínimo 6 caracteres.'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Middleware pre-save: hasheia a senha antes de persistir.
 */
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * Compara a senha candidata com o hash armazenado.
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Remove o campo password ao serializar para JSON.
 */
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as unknown as Record<string, unknown>).password;
    return ret;
  },
});

export const User = mongoose.model<IUserDocument>('User', UserSchema);
