import { formatValidationErrors } from 'io-ts-reporters';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { Logger, FetchRelatedArticles } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';

// ts-unused-exports:disable-next-line
export type Ports = {
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

export const fetchRecommendedPapers = (ports: Ports): FetchRelatedArticles => (doi: Doi) => pipe(
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
    (response) => pipe(
      response.recommendedPapers,
      RA.map((recommendedPaper) => ({
        articleId: recommendedPaper.externalIds.DOI,
        title: sanitise(toHtmlFragment(recommendedPaper.title)),
        authors: pipe(
          recommendedPaper.authors,
          RA.map((author) => author.name),
          O.some,
        ),
      })),
    ),
  ),
);
