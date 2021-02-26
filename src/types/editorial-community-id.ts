import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export class EditorialCommunityId {
  readonly value: string;

  constructor(input: string) {
    this.value = input;
  }

  toString(): string {
    return this.value;
  }
}

export const fromString = (value: string): O.Option<EditorialCommunityId> => (
  pipe(new EditorialCommunityId(value), O.some)
);

export const eqEditorialCommunityId = Eq.contramap((id: EditorialCommunityId) => id.value)(Eq.eqString);
