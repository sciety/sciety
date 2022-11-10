export const getSecretSafely = (token: string | undefined): string => {
  if (!token || token === '') {
    return [...Array(48)]
      .map(() => Math.random().toString(36)[2])
      .join('');
  }
  return token;
};
