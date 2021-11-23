// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;
