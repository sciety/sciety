export type GetSome<T> = (T & { _tag: 'Some', value: unknown })['value'];

export type GetRight<T> = (T & { _tag: 'Right', right: unknown })['right'];

type Tagged = Record<string, unknown> & { tag: string };

export type GetTag<A extends Tagged, T extends A['tag']> = (A & { tag: T });

export type FromObjectInsideArray<
A extends ReadonlyArray<Record<string, unknown>>,
K extends keyof A[number],
> = ReadonlyArray<A[number][K]>;
