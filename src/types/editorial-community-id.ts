import * as Eq from 'fp-ts/Eq';

export class EditorialCommunityId {
  readonly value: string;

  constructor(input: string) {
    this.value = input;
  }

  toString(): string {
    return this.value;
  }
}

export const eqEditorialCommunityId = Eq.contramap((id: EditorialCommunityId) => id.value)(Eq.eqString);
