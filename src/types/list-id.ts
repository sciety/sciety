export type ListId = string; // & { readonly ListId: unique symbol };

export const fromValidatedString = (value: string): ListId => value as ListId;

export const isListId = (value: unknown): value is ListId => typeof value === 'string';
