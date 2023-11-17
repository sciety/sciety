import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, constructArticleCard } from '../../../shared-components/article-card/index.js';
import { ArticleActivity } from '../../../types/article-activity.js';
import { Dependencies } from './dependencies.js';

type PopulateArticleViewModelsSkippingFailures = (
  dependencies: Dependencies,
) => (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  dependencies,
) => (activities) => pipe(
  activities,
  RA.map((activity) => pipe(
    activity.articleId,
    constructArticleCard(dependencies),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
