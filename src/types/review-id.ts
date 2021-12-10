import { URL } from 'url';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';

const supportedServices = ['doi', 'hypothesis', 'ncrc', 'prelights', 'rapidreviews'];

const startsWithSupportedService = (input: string): boolean => pipe(
  supportedServices,
  RA.some((svc) => input.startsWith(`${svc}:`)),
);

export const reviewIdCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, { readonly ReviewId: unique symbol }> => startsWithSupportedService(input),
  'ReviewId',
);

export type ReviewId = t.TypeOf<typeof reviewIdCodec>;

export const isReviewId = reviewIdCodec.is;

export const deserialize = flow(
  reviewIdCodec.decode,
  O.fromEither,
);

export const serialize = reviewIdCodec.encode;

export const service = (id: ReviewId): string => id.split(':')[0];

export const key = (id: ReviewId): string => id.slice(id.indexOf(':') + 1);

const urlTemplates = ({
  doi: (id: ReviewId) => `https://doi.org/${key(id)}`,
  hypothesis: (id: ReviewId) => `https://hypothes.is/a/${key(id)}`,
  prelights: (id: ReviewId) => key(id),
  rapidreviews: (id: ReviewId) => key(id),
});

export const inferredSourceUrl = (id: ReviewId): O.Option<URL> => pipe(
  urlTemplates,
  R.lookup(service(id)),
  O.map((template) => template(id)),
  O.map((u) => new URL(u)),
);

const eq: Eq.Eq<ReviewId> = pipe(
  S.Eq,
  Eq.contramap(serialize),
);

export const { equals } = eq;
