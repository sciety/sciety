import { DOI } from '../types/doi';

const doiRegex = /^(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.[0-9]{4,}(?:\.[1-9][0-9]*)*\/(?:[^%"#?\s])+)$/;

export default (something: string): DOI => {
  const [, doi] = doiRegex.exec(something) || [];

  if (!doi) {
    throw new Error('Not a possible DOI.');
  }
  return {
    toString(): string { return doi; },
  };
};
