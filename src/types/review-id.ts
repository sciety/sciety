import { URL } from 'url';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { Doi } from './doi';
import { HypothesisAnnotationId } from './hypothesis-annotation-id';
import * as NcrcId from './ncrc-id';

type ServiceBasedReviewId = string & { readonly ServiceBasedReviewId: unique symbol };

export type ReviewId = Doi | HypothesisAnnotationId | NcrcId.NcrcId | ServiceBasedReviewId;

const toReviewId = (serialization: string): ReviewId => {
  const [, protocol, value] = /^(.+?):(.+)$/.exec(serialization) ?? [];
  switch (protocol) {
    case 'doi':
      return new Doi(value);
    case 'hypothesis':
      return new HypothesisAnnotationId(value);
    case 'ncrc':
      return NcrcId.fromString(value);
    case 'prelights':
      return serialization as unknown as ServiceBasedReviewId;
    default:
      throw new Error(`Unable to unserialize ReviewId: "${serialization}"`);
  }
};

export const deserialize = (value: string): O.Option<ReviewId> => O.tryCatch(() => toReviewId(value));

export const serialize = (id: ReviewId): string => {
  if (id instanceof Doi || id instanceof HypothesisAnnotationId) {
    return id.toString();
  }

  if (NcrcId.isNrcId(id)) {
    return `ncrc:${id.value}`;
  }

  return id;
};

export const service = (id: ReviewId): string => {
  if (id instanceof Doi) {
    return 'doi';
  }
  if (id instanceof HypothesisAnnotationId) {
    return 'hypothesis';
  }
  if (NcrcId.isNrcId(id)) {
    return 'ncrc';
  }
  return 'prelights';
};

export const key = (id: ReviewId): string => {
  if (id instanceof Doi) {
    return id.value;
  }
  if (id instanceof HypothesisAnnotationId) {
    return id.value;
  }
  if (NcrcId.isNrcId(id)) {
    return id.value;
  }
  return id.replace(/^prelights:/, '');
};

export const inferredUrl = (id: ReviewId): O.Option<URL> => {
  if (id instanceof Doi) {
    return O.some(new URL(`https://doi.org/${id.value}`));
  }
  if (id instanceof HypothesisAnnotationId) {
    return O.some(new URL(`https://hypothes.is/a/${id.value}`));
  }
  if (NcrcId.isNrcId(id)) {
    return O.none;
  }
  return O.some(new URL(key(id)));
};

export const isReviewId = (value: unknown): value is ReviewId => (
  value instanceof HypothesisAnnotationId || value instanceof Doi || NcrcId.isNrcId(value)
);

const eq: Eq.Eq<ReviewId> = pipe(
  S.Eq,
  Eq.contramap(serialize),
);

export const { equals } = eq;
