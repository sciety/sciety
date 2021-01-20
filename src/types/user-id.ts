export type UserId = string & { readonly UserId: unique symbol };

const isUserId = (value: string): value is UserId => value !== '';

export const toUserId = (value: string): UserId => {
  if (isUserId(value)) {
    return value;
  }
  throw new Error();
};
