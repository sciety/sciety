import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { Doi } from './doi';
import { HypothesisAnnotationId } from './hypothesis-annotation-id';
import * as NcrcId from './ncrc-id';

export type ReviewId = Doi | HypothesisAnnotationId | NcrcId.NcrcId;

const toReviewId = (serialization: string): ReviewId => {
  const [, protocol, value] = /^(.+?):(.+)$/.exec(serialization) ?? [];
  switch (protocol) {
    case 'doi':
      return new Doi(value);
    case 'hypothesis':
      return new HypothesisAnnotationId(value);
    case 'ncrc':
      return NcrcId.fromString(value);
    default:
      throw new Error(`Unable to unserialize ReviewId: "${serialization}"`);
  }
};

export const deserialize = (value: string): O.Option<ReviewId> => O.tryCatch(() => toReviewId(value));

export const serialize = (id: ReviewId): string => {
  if (id instanceof Doi || id instanceof HypothesisAnnotationId) {
    return id.toString();
  }

  // NcrcId case
  return `ncrc:${id.value}`;
};

export const service = (id: ReviewId): string => {
  if (id instanceof Doi) {
    return 'doi';
  }
  if (id instanceof HypothesisAnnotationId) {
    return 'hypothesis';
  }
  return 'ncrc';
};

export const isReviewId = (value: unknown): value is ReviewId => (
  value instanceof HypothesisAnnotationId || value instanceof Doi || NcrcId.isNrcId(value)
);

const eq: Eq.Eq<ReviewId> = pipe(
  S.Eq,
  Eq.contramap(serialize),
);

export const { equals } = eq;
