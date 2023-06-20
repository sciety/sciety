import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { getCurationStatements } from '../../../shared-components/article-card/get-curation-statements';

export const constructRelatedArticles = (
  doi: Doi, dependencies: Dependencies,
): T.Task<ViewModel['relatedArticles']> => pipe(
  dependencies.fetchRelatedArticles(doi),
  TE.map(RA.takeLeft(3)),
  TE.map(RA.map((recommendedPaper) => ({
    articleId: recommendedPaper.articleId,
    title: recommendedPaper.title,
    authors: recommendedPaper.authors,
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
    curationStatements: getCurationStatements(doi),
  }))),
  TO.fromTaskEither,
);
