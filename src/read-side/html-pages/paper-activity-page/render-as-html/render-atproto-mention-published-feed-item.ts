import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { AtprotoMentionPublishedFeedItem } from '../view-model';

const renderAvatar = (avatarUrl: AtprotoMentionPublishedFeedItem['authorAvatarUrl']) => pipe(
  avatarUrl,
  O.match(
    () => '',
    (src) => `<img class="activity-feed-item__avatar" src="${htmlEscape(src)}" alt="">`,
  ),
);

const renderAuthor = (feedItem: AtprotoMentionPublishedFeedItem) => pipe(
  feedItem.authorName,
  O.match(
    () => `@${htmlEscape(feedItem.authorHandle)}`,
    (name) => `${htmlEscape(name)}<br>(@${htmlEscape(feedItem.authorHandle)})`,
  ),
);

const sourceIcons: Record<AtprotoMentionPublishedFeedItem['source'], string> = {
  Bluesky: '<img class="activity-feed-item__source-icon" src="/static/images/bluesky-social-icon.svg" alt="">',
  Semble: '<img class="activity-feed-item__source-icon" src="/static/images/semble-social-icon.svg" alt="">',
};

type RenderAtprotoMentionPublishedFeedItem = (feedItem: AtprotoMentionPublishedFeedItem) => HtmlFragment;

export const renderAtprotoMentionPublishedFeedItem: RenderAtprotoMentionPublishedFeedItem = (
  feedItem,
) => toHtmlFragment(`
  <div class="activity-feed-item-contents activity-feed-item-contents--social-mention">
    <header class="activity-feed-item__header">
      <div class="activity-feed-item__header__author-information">
        ${renderAvatar(feedItem.authorAvatarUrl)}
        <div class="activity-feed-item__title">
          <a href="${htmlEscape(feedItem.href)}">
            ${renderAuthor(feedItem)} via ${htmlEscape(feedItem.source)}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed-item__date')}
      </div>
      ${sourceIcons[feedItem.source]}
    </header>
    <div class="activity-feed-item__body">
      <p>${htmlEscape(feedItem.text)}</p>
    </div>
  </div>
`);
