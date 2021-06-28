import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import {
  FindReviewsForArticleDoi, populateArticleViewModel,
} from './populate-article-view-model';
import { renderSavedArticles } from './render-saved-articles';
import { renderArticleCard } from '../../shared-components/article-card';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { informationUnavailable, noSavedArticles } from '../static-messages';

type FetchArticle = (doi: Doi) => TE.TaskEither<unknown, {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
}>;

export type Ports = {
  fetchArticle: FetchArticle,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

type SavedArticles = (ports: Ports) => (
  dois: TE.TaskEither<'no-saved-articles', RNEA.ReadonlyNonEmptyArray<Doi>>,
) => TE.TaskEither<never, { content: HtmlFragment, count: number }>;

export const savedArticles: SavedArticles = (ports) => (dois) => pipe(
  dois,
  TE.mapLeft(() => noSavedArticles),
  TE.chain(flow(
    TE.traverseArray(ports.fetchArticle),
    TE.mapLeft(() => informationUnavailable),
  )),
  TE.chainTaskK(
    T.traverseArray(populateArticleViewModel({
      findReviewsForArticleDoi: ports.findReviewsForArticleDoi,
      getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
    })),
  ),
  TE.map(flow(
    RA.map(renderArticleCard),
    renderSavedArticles,
  )),
  TE.toUnion,
  TE.rightTask,
  TE.chainTaskK((content) => pipe(
    {
      content: T.of(content),
      count: pipe(
        dois,
        TE.match(
          () => 0,
          (articles) => articles.length,
        ),
      ),
    },
    sequenceS(T.ApplyPar),
  )),
);
