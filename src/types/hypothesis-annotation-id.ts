export default class HypothesisAnnotationId {
  readonly value: string;

  constructor(input: string) {
    const prefix = 'hypothesis:';
    this.value = input.startsWith(prefix) ? input.substring(prefix.length) : input;
  }

  toString(): string {
    return `hypothesis:${this.value}`;
  }
}
