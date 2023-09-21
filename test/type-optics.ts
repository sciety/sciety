export type GetSome<T> = (T & { _tag: 'Some', value: unknown })['value'];

type Tagged = Record<string, unknown> & { tag: string };

export type GetTag<A extends Tagged, T extends A['tag']> = (A & { tag: T });
