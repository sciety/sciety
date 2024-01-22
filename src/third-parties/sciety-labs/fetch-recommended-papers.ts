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

const scietyLabsRecommendedPapersResponseCodec = t.type({
  recommendedPapers: t.array(t.union([paperWithDoi, paperWithoutDoi])),
});

type PaperWithDoi = t.TypeOf<typeof paperWithDoi>;

export const fetchRecommendedPapers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchRecommendedPapers'] => (expressionDoi) => pipe(
  `https://labs.sciety.org/api/like/s2/recommendations/v1/papers/forpaper/DOI:${expressionDoi}?fields=externalIds`,
  queryExternalService(),
  TE.chainEitherKW(flow(
    scietyLabsRecommendedPapersResponseCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft(
      (errors) => {
        logger('error', 'Failed to decode Sciety Labs response', {
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
  TE.map(RA.filter((recommendedDoi) => {
    const isValid = EDOI.isValidDoi(recommendedDoi);
    if (!isValid) {
      logger('debug', 'fetchRecommendedPapers discarded a recommendation as corrupt', { recommendedDoi, expressionDoi });
    }
    return isValid;
  })),
  TE.map(RA.filter((recommendedDoi) => {
    const isSupported = isSupportedArticle(recommendedDoi);
    if (!isSupported) {
      logger('debug', 'fetchRecommendedPapers discarded a recommendation as unsupported', { recommendedDoi, expressionDoi });
    }
    return isSupported;
  })),
  TE.map(RA.map(EDOI.fromValidatedString)),
);
