import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, constructArticleCardViewModel, ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card';
import { ArticleActivity } from '../../../types/article-activity';

export type Ports = ConstructArticleCardViewModelDependencies;

type PopulateArticleViewModelsSkippingFailures = (
  dependencies: Ports,
) => (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  dependencies,
) => (activities) => pipe(
  activities,
  RA.map((activity) => pipe(
    activity.articleId,
    constructArticleCardViewModel(dependencies),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
