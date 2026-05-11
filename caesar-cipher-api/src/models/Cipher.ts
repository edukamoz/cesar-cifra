import mongoose, { Schema } from "mongoose";
import { ICipherDocument } from "../types";

const CipherSchema = new Schema<ICipherDocument>(
  {
    hash: {
      type: String,
      required: [true, "Hash é obrigatório."],
      unique: true,
      index: true,
    },
    step: {
      type: Number,
      required: [true, "Passo (step) é obrigatório."],
    },
    messageHash: {
      type: String,
      required: false, // Opcional para compatibilidade com dados antigos
      index: false,
    },
    used: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId é obrigatório."],
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Cipher = mongoose.model<ICipherDocument>("Cipher", CipherSchema);
