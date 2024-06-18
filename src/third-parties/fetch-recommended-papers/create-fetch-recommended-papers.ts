import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import * as EDOI from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

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
}, 'scietyLabsRecommendedPapersResponseCodec');

type PaperWithDoi = t.TypeOf<typeof paperWithDoi>;

export const createFetchRecommendedPapers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchRecommendedPapers'] => (history) => {
  const url = pipe(
    history,
    PH.getLatestPreprintExpression,
    (expression) => expression.expressionDoi,
    (expressionDoi) => `https://labs.sciety.org/api/like/s2/recommendations/v1/papers/forpaper/DOI:${expressionDoi}?fields=externalIds`,
  );

  return pipe(
    url,
    queryExternalService(),
    TE.chainEitherKW(flow(
      decodeAndLogFailures(logger, scietyLabsRecommendedPapersResponseCodec, { url }),
      E.mapLeft(() => DE.unavailable),
    )),
    TE.map(
      (response) => pipe(
        response.recommendedPapers,
        RA.filter(
          (recommendedPaper): recommendedPaper is PaperWithDoi => recommendedPaper.externalIds.DOI !== undefined,
        ),
        RA.map((recommendedPaper) => recommendedPaper.externalIds.DOI),
      ),
    ),
    TE.map(RA.filter((recommendedDoi) => {
      const isValid = EDOI.isValidDoi(recommendedDoi);
      if (!isValid) {
        logger('debug', 'fetchRecommendedPapers discarded a recommendation as corrupt', { recommendedDoi, url });
      }
      return isValid;
    })),
    TE.map(RA.map(EDOI.fromValidatedString)),
  );
};
