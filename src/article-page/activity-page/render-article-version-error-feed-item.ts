import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ServerInfo = {
  name: string,
  avatarUrl: string,
  versionsSupported: boolean,
};

const servers: Record<ArticleServer, ServerInfo> = {
  biorxiv: {
    name: 'bioRxiv',
    avatarUrl: '/static/images/biorxiv.jpg',
    versionsSupported: true,
  },
  medrxiv: {
    name: 'medRxiv',
    avatarUrl: '/static/images/medrxiv.jpg',
    versionsSupported: true,
  },
  researchsquare: {
    name: 'Research Square',
    avatarUrl: '/static/images/researchsquare.png',
    versionsSupported: false,
  },
};

export const renderVersionErrorFeedItem = (server: ArticleServer): HtmlFragment => pipe(
  servers[server],
  (viewModel) => `
    <div class="activity-feed__item_contents">
      <header class="activity-feed__item_header">
        <img class="activity-feed__item__avatar" src="${viewModel.avatarUrl}" alt="">
        <div class="activity-feed__item__meta">
          <div class="activity-feed__item__title">
            Published on ${viewModel.name}
          </div>
        </div>
      </header>
      <p>
        We couldn't get version information from ${viewModel.name}.
        ${viewModel.versionsSupported ? 'Please try refreshing this page, or try again later.' : ''}
      </p>
    </div>
  `,
  toHtmlFragment,
);
