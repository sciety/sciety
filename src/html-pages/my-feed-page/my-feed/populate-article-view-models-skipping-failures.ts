import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, constructArticleCardViewModel } from '../../../shared-components/article-card';
import { Dependencies } from './dependencies';
import { Doi } from '../../../types/doi';

type PopulateArticleViewModelsSkippingFailures = (
  dependencies: Dependencies,
) => (
  activities: ReadonlyArray<Doi>
) => T.Task<ReadonlyArray<ArticleCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  dependencies,
) => (articleIds) => pipe(
  articleIds,
  RA.map((articleId) => pipe(
    articleId,
    constructArticleCardViewModel(dependencies),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
