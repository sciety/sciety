export type B = string & { readonly B: unique symbol };

export const isB = (x: unknown): x is B => typeof x === 'string' && x.startsWith('b:');

export const fromString = (x: string): B => `b:${x}` as B;
