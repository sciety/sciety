import { formatValidationErrors } from 'io-ts-reporters';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { Json } from 'fp-ts/Json';
import { Doi } from '../../types/doi';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { Logger, FetchRecommendedPapers } from '../../shared-ports';
import * as DE from '../../types/data-error';

type Ports = {
  getJson: (uri: string) => Promise<Json>,
  logger: Logger,
};

const semanticScholarRecommendedPapersResponseCodec = t.type({
  recommendedPapers: t.array(t.type({
    externalIds: t.type({
      DOI: DoiFromString,
    }),
    title: t.string,
    authors: t.array(t.type({
      name: t.string,
    })),
  })),
});

export const fetchRecommendedPapers = (ports: Ports): FetchRecommendedPapers => (doi: Doi) => pipe(
  TE.tryCatch(async () => ports.getJson(`https://api.semanticscholar.org/recommendations/v1/papers/forpaper/DOI:${doi.value}?fields=externalIds,authors,title`), String),
  TE.chainEitherKW(flow(
    semanticScholarRecommendedPapersResponseCodec.decode,
    E.mapLeft(formatValidationErrors),
  )),
  TE.bimap(
    (errors) => {
      ports.logger('error', 'Failed to decode Semantic scholar response', {
        errors,
      });

      return DE.unavailable;
    },
    (response) => response.recommendedPapers,
  ),
);
