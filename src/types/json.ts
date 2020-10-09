// See https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081

export type JsonObject = { [prop: string]: Json };

export type Json =
  | null
  | boolean
  | number
  | string
  | Array<Json>
  | ReadonlyArray<Json>
  | JsonObject;

export type JsonCompatible<Type> = {
  [Property in keyof Type]: Type[Property] extends Json
    ? Type[Property]
    : Pick<Type, Property> extends Required<Pick<Type, Property>>
      ? never
      : Type[Property] extends (() => unknown) | undefined
        ? never
        : JsonCompatible<Type[Property]>;
};
