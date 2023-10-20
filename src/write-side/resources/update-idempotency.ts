export const isEmpty = <T extends Record<string, unknown>>(object: T): boolean => Object.keys(object).length === 0;

type OnlyKeepUpdatedFields = <C extends Record<string, unknown>>(command: C) => <S extends C>(state: S) => C;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onlyKeepUpdatedFields: OnlyKeepUpdatedFields = (command) => (state) => command;
