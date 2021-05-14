export type A = string & { readonly A: unique symbol };

export const isA = (x: unknown): x is A => typeof x === 'string' && x.startsWith('a:');

export const fromString = (x: string): A => `a:${x}` as A;
