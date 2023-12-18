export type ExpressionDoi = string & { readonly ExpressionDoi: unique symbol };

export const fromValidatedString = (value: string): ExpressionDoi => value as ExpressionDoi;
