import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../../../types/doi';
import { ArticleViewModel } from '../../../shared-components/article-card';
import { FetchRelatedArticles } from '../../../shared-ports';

export type Ports = {
  fetchRelatedArticles: FetchRelatedArticles,
};

export const constructRelatedArticles = (
  doi: Doi, ports: Ports,
): TO.TaskOption<ReadonlyArray<ArticleViewModel>> => pipe(
  ports.fetchRelatedArticles(doi),
  TE.map(RA.takeLeft(3)),
  TE.map(RA.map((recommendedPaper) => ({
    articleId: recommendedPaper.articleId,
    title: recommendedPaper.title,
    authors: recommendedPaper.authors,
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  }))),
  TO.fromTaskEither,
);
