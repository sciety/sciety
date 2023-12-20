import { formatValidationErrors } from 'io-ts-reporters';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { isSupportedArticle } from '../../types/article-server';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';
import * as EDOI from '../../types/expression-doi';

const paperWithoutDoi = t.type({
  externalIds: t.type({
    DOI: t.undefined,
  }),
});

const paperWithDoi = t.type({
  externalIds: t.type({
    DOI: t.string,
  }),
});

const semanticScholarRecommendedPapersResponseCodec = t.type({
  recommendedPapers: t.array(t.union([paperWithDoi, paperWithoutDoi])),
});

type PaperWithDoi = t.TypeOf<typeof paperWithDoi>;

export const fetchRecommendedPapers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchRelatedArticles'] => (expressionDoi) => pipe(
  `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/DOI:${expressionDoi}?fields=externalIds,authors,title`,
  queryExternalService(),
  TE.chainEitherKW(flow(
    semanticScholarRecommendedPapersResponseCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft(
      (errors) => {
        logger('error', 'Failed to decode Semantic scholar response', {
          errors,
          expressionDoi,
        });
        return DE.unavailable;
      },
    ),
  )),
  TE.map(
    (response) => pipe(
      response.recommendedPapers,
      RA.filter((recommendedPaper): recommendedPaper is PaperWithDoi => recommendedPaper.externalIds.DOI !== undefined),
      RA.map((recommendedPaper) => recommendedPaper.externalIds.DOI),
    ),
  ),
  TE.map(RA.filter((relatedArticle) => EDOI.isValidDoi(relatedArticle))),
  TE.map(RA.filter((relatedArticle) => isSupportedArticle(relatedArticle))),
  TE.map(RA.map(EDOI.fromValidatedString)),
);
