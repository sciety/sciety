import { formatValidationErrors } from 'io-ts-reporters';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { ArticleId, doiRegex } from '../../types/article-id';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { isSupportedArticle } from '../../types/article-server';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';

const paperWithoutDoi = t.type({
  externalIds: t.type({
    DOI: t.undefined,
  }),
});

const paperWithDoi = t.type({
  externalIds: t.type({
    DOI: t.string,
  }),
  title: t.string,
  authors: t.array(t.type({
    name: t.string,
  })),
});

const semanticScholarRecommendedPapersResponseCodec = t.type({
  recommendedPapers: t.array(t.union([paperWithDoi, paperWithoutDoi])),
});

const isValidDoi = (value: string): boolean => doiRegex.test(value);

type PaperWithDoi = t.TypeOf<typeof paperWithDoi>;

export const fetchRecommendedPapers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchRelatedArticles'] => (doi: ArticleId) => pipe(
  `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/DOI:${doi.value}?fields=externalIds,authors,title`,
  queryExternalService(),
  TE.chainEitherKW(flow(
    semanticScholarRecommendedPapersResponseCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft(
      (errors) => {
        logger('error', 'Failed to decode Semantic scholar response', {
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
  TE.map(RA.filter((relatedArticle) => isValidDoi(relatedArticle.articleId))),
  TE.map(RA.filter((relatedArticle) => isSupportedArticle(relatedArticle.articleId))),
  TE.map(RA.map((item) => ({
    ...item,
    articleId: new ArticleId(item.articleId),
  }))),
);
