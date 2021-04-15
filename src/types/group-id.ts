import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

export class GroupId {
  readonly value: string;

  constructor(input: string) {
    if (input.length === 0) {
      throw new Error(`'${input}' is not a GroupId`);
    }
    this.value = input;
  }

  toString(): string {
    return this.value;
  }
}

export const fromString = (value: string): O.Option<GroupId> => (O.tryCatch(() => new GroupId(value)));

export const fromNullable = (value?: string): O.Option<GroupId> => pipe(
  value,
  O.fromNullable,
  O.chain(fromString),
);

export const eqGroupId: Eq.Eq<GroupId> = pipe(
  S.Eq,
  Eq.contramap((id) => id.value),
);
