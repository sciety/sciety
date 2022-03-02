export type ListId = string; // & { readonly ListId: unique symbol };

export const fromValidatedString = (value: string): ListId => value as ListId;
