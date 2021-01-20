const doiRegex = /^(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.[0-9]{4,}(?:\.[1-9][0-9]*)*\/(?:[^%"#?\s])+)$/;

export class Doi {
  readonly value: string;

  constructor(input: string) {
    const [, doi] = doiRegex.exec(input) ?? [];

    if (!doi) {
      throw new Error(`'${input}' is not a possible DOI`);
    }

    this.value = doi;
  }

  hasPrefix(prefix: string): boolean {
    return this.value.startsWith(`${prefix}/`);
  }

  toString(): string {
    return `doi:${this.value}`;
  }
}
