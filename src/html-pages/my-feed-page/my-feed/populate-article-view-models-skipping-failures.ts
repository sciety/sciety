import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, constructArticleCardViewModel, ConstructArticleCardViewModelPorts } from '../../../shared-components/article-card';
import { ArticleActivity } from '../../../types/article-activity';

export type Ports = ConstructArticleCardViewModelPorts;

type PopulateArticleViewModelsSkippingFailures = (
  ports: Ports,
) => (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  ports,
) => (activities) => pipe(
  activities,
  RA.map((activity) => pipe(
    activity.articleId,
    constructArticleCardViewModel(ports),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
