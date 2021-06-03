import { toHtmlFragment } from '../../types/html-fragment';

export const biorxivArticleVersionErrorFeedItem = toHtmlFragment(`
  <div class="activity-feed__item_contents">
    <img class="activity-feed__item__avatar" src="/static/images/biorxiv.jpg" alt="">
    <div>
      <p class="activity-feed__item__title">
        Published on bioRxiv
      </p>
      <p>
        We couldn't get version information from bioRxiv. Please try refreshing this page.
      </p>
    </div>
  </div>
`);

export const medrxivArticleVersionErrorFeedItem = toHtmlFragment(`
  <div class="activity-feed__item_contents">
    <img class="activity-feed__item__avatar" src="/static/images/medrxiv.jpg" alt="">
    <div>
      <p class="activity-feed__item__title">
        Published on medRxiv
      </p>
      <p>
        We couldn't get version information from medRxiv. Please try refreshing this page.
      </p>
    </div>
  </div>
`);
