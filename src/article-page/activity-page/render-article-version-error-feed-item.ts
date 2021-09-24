import { toHtmlFragment } from '../../types/html-fragment';

export const biorxivArticleVersionErrorFeedItem = toHtmlFragment(`
  <div class="activity-feed__item_contents">
    <header class="activity-feed__item_header">
      <img class="activity-feed__item__avatar" src="/static/images/biorxiv.jpg" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          Published on bioRxiv
        </div>
      </div>
    </header>
    <p>
      We couldn't get version information from bioRxiv. Please try refreshing this page.
    </p>
  </div>
`);

export const medrxivArticleVersionErrorFeedItem = toHtmlFragment(`
  <div class="activity-feed__item_contents">
    <header class="activity-feed__item_header">
      <img class="activity-feed__item__avatar" src="/static/images/medrxiv.jpg" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          Published on medRxiv
        </div>
      </div>
    </header>
    <p>
      We couldn't get version information from medRxiv. Please try refreshing this page.
    </p>
  </div>
`);
