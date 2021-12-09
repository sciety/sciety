export const getSecretSafely = (token: string | undefined): string => token ?? Math.random().toString(36);
