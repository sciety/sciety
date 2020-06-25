export default class HypothesisAnnotationId {
  readonly value: string;

  constructor(input: string) {
    this.value = input;
  }

  toString(): string {
    return `hypothesis:${this.value}`;
  }
}
