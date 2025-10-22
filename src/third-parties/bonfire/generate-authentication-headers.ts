const getUserToken = () => '';

export const generateAuthenticationHeaders = (): Record<string, string> => ({ Authorization: `Bearer ${getUserToken()}` });
