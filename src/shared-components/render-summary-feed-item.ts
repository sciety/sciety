import { sequenceS } from 'fp-ts/lib/Apply';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import templateDate from './date';
import { Doi } from '../types/doi';
import {
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityEndorsedArticleEvent,
} from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

type RenderSummaryFeedItem = (event: FeedEvent) => T.Task<HtmlFragment>;

const reviewedBy = (actor: Actor): string => (
  (actor.name === 'preLights') ? 'highlighted' : 'reviewed'
);

const verb = (event: FeedEvent, actor: Actor): string => (
  isEditorialCommunityEndorsedArticleEvent(event) ? 'endorsed' : reviewedBy(actor)
);

type ViewModel = {
  avatar: string,
  date: Date,
  actorName: string,
  actorUrl: string,
  doi: Doi,
  title: HtmlFragment,
  verb: string,
};

const render = (viewModel: ViewModel): string => `
  <div class="summary-feed-item">
    <img src="${viewModel.avatar}" alt="" class="summary-feed-item__avatar">
    <div>
      ${templateDate(viewModel.date, 'summary-feed-item__date')}
      <div class="summary-feed-item__title">
        <a href="${viewModel.actorUrl}" class="summary-feed-item__link">${viewModel.actorName}</a>
        ${viewModel.verb}
        <a href="/articles/${viewModel.doi.value}" class="summary-feed-item__link">${viewModel.title}</a>
      </div>
    </div>
  </div>
`;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type Article = {
  title: SanitisedHtmlFragment;
};

type Inputs = {
  actor: Actor,
  article: Result<Article, unknown>,
  event: FeedEvent,
};

const constructViewModel = ({ actor, article, event }: Inputs): ViewModel => ({
  avatar: actor.imageUrl,
  date: event.date,
  actorName: actor.name,
  actorUrl: actor.url,
  doi: event.articleId,
  title: article.mapOr(toHtmlFragment('an article'), (a) => a.title),
  verb: verb(event, actor),
});

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export const renderSummaryFeedItem = (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderSummaryFeedItem => (event) => pipe(
  {
    actor: getActor(event.editorialCommunityId),
    article: getArticle(event.articleId),
    event: T.of(event),
  },
  sequenceS(T.task),
  T.map(flow(
    constructViewModel,
    render,
    toHtmlFragment,
  )),
);
