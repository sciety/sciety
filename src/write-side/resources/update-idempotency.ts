export const isEmpty = <T extends Record<string, unknown>>(object: T): boolean => Object.keys(object).length === 0;
