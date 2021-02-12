import { Doi } from './doi';
import { HypothesisAnnotationId } from './hypothesis-annotation-id';

export type ReviewId = Doi | HypothesisAnnotationId;

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
