import { Doi } from './doi';
import { HypothesisAnnotationId } from './hypothesis-annotation-id';
import { NcrcId } from './ncrc-id';

export type ReviewId = Doi | HypothesisAnnotationId | NcrcId;

export const toReviewId = (serialization: string): ReviewId => {
  const [, protocol, value] = /^(.+?):(.+)$/.exec(serialization) ?? [];
  switch (protocol) {
    case 'doi':
      return new Doi(value);
    case 'hypothesis':
      return new HypothesisAnnotationId(value);
    default:
      throw new Error(`Unable to unserialize ReviewId: "${serialization}"`);
  }
};

export const toString = (id: ReviewId): string => {
  if (id instanceof Doi || id instanceof HypothesisAnnotationId) {
    return id.toString();
  }
  // NcrcId case
  return `ncrc:${id.value}`;
};
