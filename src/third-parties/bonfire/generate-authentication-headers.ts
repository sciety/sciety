export const generateAuthenticationHeaders = (): Record<string, string> => {
  const token = '';
  return { Authorization: `Bearer ${token}` };
};
