export type GetSome<T> = (T & { _tag: 'Some', value: unknown })['value'];
