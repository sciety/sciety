import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderEvaluationPublishedFeedItem } from './render-evaluation-published-feed-item';
import { renderExpressionPublishedFeedItem } from './render-expression-published-feed-item';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { renderListItems } from '../../shared-components/list-items';
import { CassyniSeminarPublishedFeedItem, FeedItem } from '../view-model';

const cassyniSeminarDoiLink = 'https://doi.org/10.52843/cassyni.y1p61f';

const cassyniSeminarVideoLink = 'https://cassyni.com/events/6ttAf8cL1ruzkWZznh5Xed?t=1516s';

const cassyniSeminarImageUrl = 'https://api.cassyni.com/api/videos/MH5YFnwYt2VpYChF8Jj9EE/poster?embedded=false';

const cassyniSeminarTitle = 'New bioinformatics resources from The International Cannabis Genome Research Consortium';

const renderCassyniSeminarPublishedFeedItem = (feedItem: CassyniSeminarPublishedFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__contents">
    <header class="activity-feed__item__header">
      <img class="activity-feed__item__avatar" src="/static/images/cassyni-logo.png" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <b>Video seminar held on Cassyni</b>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
    <div class="activity-feed__item__body">
      <p>Seminar title: ${cassyniSeminarTitle}</p>
      <p>The following video starts at 25min 16sec.</p>
      <a class="activity-feed__item__video_link" href=${cassyniSeminarVideoLink}>
        <span class="visually-hidden">Go to the seminar on Cassyni starting at the relevant time stamp.</span>
        <img src=${cassyniSeminarImageUrl} alt="">
        <svg class="activity-feed__item__play_icon">
          <style>
            .icon:hover circle {
              fill: rgb(206, 72, 26, 0.8);
            }
          </style>
          <g class="icon">
            <circle cx="50" cy="50" r="50" fill="#00000090"/>
            <polygon points="30 20, 80 50, 30 80" fill="#ffffff"></polygon>
          </g>
        </svg>
      </a>
      <p><a href=${cassyniSeminarDoiLink}>Watch the whole seminar on Cassyni.</a></p>
    </div>
  </div>
`);

const renderFeedItem = (feedItem: FeedItem) => {
  switch (feedItem.type) {
    case 'expression-published':
      return renderExpressionPublishedFeedItem(feedItem);
    case 'evaluation-published':
      return renderEvaluationPublishedFeedItem(feedItem, 850);
    case 'cassyni-seminar-published':
      return renderCassyniSeminarPublishedFeedItem(feedItem);
  }
};

export const renderFeed = (feedItems: ReadonlyArray<FeedItem>): HtmlFragment => pipe(
  feedItems,
  RA.map(renderFeedItem),
  RA.match(
    () => '',
    (items) => `
    <section class="activity-feed">
      <h2 class="activity-feed__header">Article activity feed</h2>
      <ol role="list" class="activity-feed__list">
        ${renderListItems(items, 'activity-feed__item')}
      </ol>
    </section>
  `,
  ),
  toHtmlFragment,
);
