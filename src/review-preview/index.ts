import { Group } from './../types/group';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../types/html-fragment';
import { renderReviewFeedItem, ReviewFeedItem } from './../article-page/render-review-feed-item';
import { RenderPageError } from '../types/render-page-error';
import { Page } from '../types/page';
import { ReviewId } from '../types/review-id';
import { GroupId } from '../types/group-id';
import sanitize from 'sanitize-html';
import { sanitise } from '../types/sanitised-html-fragment';
import { FetchReview } from '../article-page/get-feed-events-content';

type ReviewPreviewPage = (params: Params) => (ports: Ports) => TE.TaskEither<RenderPageError, Page>;

type Params = {
  id: ReviewId,
};

type Ports = {
  fetchReview: FetchReview,
};

export const reviewPreviewPage: ReviewPreviewPage = ({id}) => (ports) => pipe(
  id,
  TE.right,
  TE.chain(ports.fetchReview),
  TE.map((review): ReviewFeedItem => ({
    id,
    type: 'review',
    source: O.none,
    occurredAt: new Date(),
    editorialCommunityId: new GroupId(''),
    editorialCommunityAvatar: '/static/images/sciety-logo.jpg',
    editorialCommunityName: 'Some Group',
    fullText: pipe(review.fullText, sanitise, O.some),
    counts: { helpfulCount: 0, notHelpfulCount: 0 },
    current: O.none,
  })),
  TE.map(renderReviewFeedItem(850)),
  TE.bimap(
    () => ({
      type: 'unavailable',
      message: toHtmlFragment(`
        We’re having trouble finding this information.
        Ensure you have the correct URL, or try refreshing the page.
        You may need to come back later.
      `),
    }),
    (reviewCard) => ({
      content: toHtmlFragment(`
        <div class="activity-page__background--filler">
          <article class="sciety-grid sciety-grid--article">
            <header class="page-header page-header--article">
              <h1>Review preview of ${id}</h1>
            </header>
            <div class="article-tabs">
              <div class="article-tabs__tab article-tabs__link">Article</div>
              <h2 class="article-tabs__tab article-tabs__heading">Activity</h2>
            </div>
            <div class="main-content">
              <section class="activity-feed">
                <ol role="list" class="activity-feed__list">
                  <li class="activity-feed__item">
                    ${reviewCard}
                  </li>
                </ol>
              </section>
            </div>
          </article>
        </div>
      `),
      title: `Review preview of ${id}`,
    }),
  ),
);

