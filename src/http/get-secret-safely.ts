export const getSecretSafely = (token: string | undefined): string => {
  if (!token || token === '') {
    return Math.random().toString(36);
  }
  return token;
};
