import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export class GroupId {
  readonly value: string;

  constructor(input: string) {
    this.value = input;
  }

  toString(): string {
    return this.value;
  }
}

export const fromString = (value: string): O.Option<GroupId> => (
  pipe(new GroupId(value), O.some)
);

export const eqGroupId: Eq.Eq<GroupId> = pipe(
  Eq.eqString,
  Eq.contramap((id) => id.value),
);
