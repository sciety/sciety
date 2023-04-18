export const getSecretSafely = (token: string | undefined): string => {
  if (!token || token === '') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return [...Array(48)]
      .map(() => Math.random().toString(36)[2])
      .join('');
  }
  return token;
};
