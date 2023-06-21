import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { constructArticleCardViewModel } from '../../../shared-components/article-card/construct-article-card-view-model';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructRelatedArticles = (
  doi: Doi, dependencies: Dependencies,
): T.Task<ViewModel['relatedArticles']> => pipe(
  dependencies.fetchRelatedArticles(doi),
  TE.map(RA.takeLeft(3)),
  TE.chainW(TE.traverseArray((recommendedPaper) => pipe(
    recommendedPaper.articleId,
    constructArticleCardViewModel(dependencies),
  ))),
  TO.fromTaskEither,
);
