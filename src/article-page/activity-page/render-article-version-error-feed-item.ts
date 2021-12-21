import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ServerInfo = {
  name: string,
  avatarUrl: string,
  versionsSupported: boolean,
};

const renderVersionErrorFeedItem = (server: ServerInfo): HtmlFragment => pipe(
  `<div class="activity-feed__item_contents">
    <header class="activity-feed__item_header">
      <img class="activity-feed__item__avatar" src="${server.avatarUrl}" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          Published on ${server.name}
        </div>
      </div>
    </header>
    <p>
      We couldn't get version information from ${server.name}.
      ${server.versionsSupported ? 'Please try refreshing this page.' : ''}
    </p>
  </div>`,
  toHtmlFragment,
);

export const biorxivArticleVersionErrorFeedItem = renderVersionErrorFeedItem({
  name: 'bioRxiv',
  avatarUrl: '/static/images/biorxiv.jpg',
  versionsSupported: true,
});

export const medrxivArticleVersionErrorFeedItem = renderVersionErrorFeedItem({
  name: 'medRxiv',
  avatarUrl: '/static/images/medrxiv.jpg',
  versionsSupported: true,
});

export const researchsquareArticleVersionErrorFeedItem = renderVersionErrorFeedItem({
  name: 'Research Square',
  avatarUrl: '/static/images/researchsquare.png',
  versionsSupported: false,
});
