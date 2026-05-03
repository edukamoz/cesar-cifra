const CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const CHARSET_LENGTH = CHARSET.length; // 36

/**
 * Função utilitária no cliente para Live Preview.
 * Simula o comportamento do servidor de forma isolada.
 */
export const livePreviewEncrypt = (message: string, step: number): string => {
  if (!message || typeof step !== 'number' || isNaN(step)) return message;

  const normalizedStep = ((step % CHARSET_LENGTH) + CHARSET_LENGTH) % CHARSET_LENGTH;

  return message
    .split('')
    .map((char) => {
      const lowerChar = char.toLowerCase();
      const index = CHARSET.indexOf(lowerChar);

      if (index === -1) return char;

      const newIndex = (index + normalizedStep) % CHARSET_LENGTH;
      const newChar = CHARSET[newIndex];

      return char === char.toUpperCase() && /[a-zA-Z]/.test(char)
        ? newChar.toUpperCase()
        : newChar;
    })
    .join('');
};
