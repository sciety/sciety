import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../../../types/doi';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ArticleViewModel } from '../../../shared-components/article-card';
import { FetchRecommendedPapers } from '../../../shared-ports';

type Ports = {
  fetchRecommendedPapers: FetchRecommendedPapers,
};

export const constructRelatedArticles = (
  doi: Doi, ports: Ports,
): TO.TaskOption<ReadonlyArray<ArticleViewModel>> => pipe(
  ports.fetchRecommendedPapers(doi),
  TE.map((response) => response.recommendedPapers),
  TE.map(RA.takeLeft(3)),
  TE.map(RA.map((recommendedPaper) => ({
    articleId: recommendedPaper.externalIds.DOI,
    title: sanitise(toHtmlFragment(recommendedPaper.title)),
    authors: pipe(
      recommendedPaper.authors,
      RA.map((author) => author.name),
      O.some,
    ),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  }))),
  TO.fromTaskEither,
);
