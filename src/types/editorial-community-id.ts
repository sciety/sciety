export default class EditorialCommunityId {
  readonly value: string;

  constructor(input: string) {
    this.value = input;
  }

  toString(): string {
    return this.value;
  }
}
