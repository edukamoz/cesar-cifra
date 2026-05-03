/**
 * Serviço da Cifra de César
 *
 * Conjunto alfanumérico considerado: a-z (26) + 0-9 (10) = 36 caracteres.
 * Caracteres fora desse conjunto são mantidos inalterados.
 */

const CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const CHARSET_LENGTH = CHARSET.length; // 36

/**
 * Cifra uma mensagem utilizando o deslocamento (passo) fornecido.
 *
 * @param message  - Texto original a ser cifrado.
 * @param step     - Quantidade de posições de deslocamento (pode ser negativo).
 * @returns          Texto cifrado.
 */
export const encrypt = (message: string, step: number): string => {
  const normalizedStep = ((step % CHARSET_LENGTH) + CHARSET_LENGTH) % CHARSET_LENGTH;

  return message
    .split('')
    .map((char) => {
      const lowerChar = char.toLowerCase();
      const index = CHARSET.indexOf(lowerChar);

      // Caractere fora do conjunto alfanumérico → preservar original
      if (index === -1) return char;

      const newIndex = (index + normalizedStep) % CHARSET_LENGTH;
      const newChar = CHARSET[newIndex];

      // Preserva o case original do caractere (apenas letras)
      return char === char.toUpperCase() && /[a-zA-Z]/.test(char)
        ? newChar.toUpperCase()
        : newChar;
    })
    .join('');
};

/**
 * Decifra uma mensagem utilizando o deslocamento (passo) fornecido.
 * Internamente, aplica o deslocamento inverso.
 *
 * @param encryptedMessage - Texto cifrado.
 * @param step             - Passo usado na cifragem original.
 * @returns                  Texto original decifrado.
 */
export const decrypt = (encryptedMessage: string, step: number): string => {
  return encrypt(encryptedMessage, -step);
};
