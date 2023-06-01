import { formatValidationErrors } from 'io-ts-reporters';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import axios from 'axios';
import { Doi } from '../../types/doi';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { Logger, FetchRelatedArticles, GetJson } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { isSupportedArticle } from '../../types/article-server';

// ts-unused-exports:disable-next-line
export type Ports = {
  getJson: GetJson,
  logger: Logger,
};

const paperWithoutDoi = t.type({
  externalIds: t.type({
    DOI: t.undefined,
  }),
});

const paperWithDoi = t.type({
  externalIds: t.type({
    DOI: DoiFromString,
  }),
  title: t.string,
  authors: t.array(t.type({
    name: t.string,
  })),
});

const semanticScholarRecommendedPapersResponseCodec = t.type({
  recommendedPapers: t.array(t.union([paperWithDoi, paperWithoutDoi])),
});

type PaperWithDoi = t.TypeOf<typeof paperWithDoi>;

const logAndTransformToDataError = (logger: Logger, url: string) => (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const logPayload = { error, response: error.response?.data };
    if (error.response?.status === 404) {
      logger('warn', 'Preprint not found on Semantic Scholar', logPayload);
      return DE.notFound;
    }
    logger('error', 'Request to Semantic Scholar failed', logPayload);
    return DE.unavailable;
  }
  logger('error', 'Request to Semantic Scholar failed', { error, url });
  return DE.unavailable;
};

const getJsonAndLog = (ports: Ports) => (url: string) => TE.tryCatch(
  async () => ports.getJson(url),
  logAndTransformToDataError(ports.logger, url),
);

export const fetchRecommendedPapers = (ports: Ports): FetchRelatedArticles => (doi: Doi) => pipe(
  `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/DOI:${doi.value}?fields=externalIds,authors,title`,
  getJsonAndLog(ports),
  TE.chainEitherKW(flow(
    semanticScholarRecommendedPapersResponseCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft(
      (errors) => {
        ports.logger('error', 'Failed to decode Semantic scholar response', {
          errors,
          doi: doi.value,
        });
        return DE.unavailable;
      },
    ),
  )),
  TE.map(
    (response) => pipe(
      response.recommendedPapers,
      RA.filter((recommendedPaper): recommendedPaper is PaperWithDoi => recommendedPaper.externalIds.DOI !== undefined),
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
  TE.map(RA.filter((relatedArticle) => isSupportedArticle(relatedArticle.articleId))),
);
