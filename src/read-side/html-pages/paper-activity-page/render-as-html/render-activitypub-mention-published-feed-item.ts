import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { ActivityPubMentionPublishedFeedItem } from '../view-model';

const renderAvatar = (avatarUrl: ActivityPubMentionPublishedFeedItem['authorAvatarUrl']) => pipe(
  avatarUrl,
  O.match(
    () => '',
    (src) => `<img class="activity-feed-item__avatar" src="${htmlEscape(src)}" alt="">`,
  ),
);

const renderAuthor = (feedItem: ActivityPubMentionPublishedFeedItem) => pipe(
  feedItem.authorName,
  O.match(
    () => `@${htmlEscape(feedItem.authorHandle)}`,
    (name) => `${htmlEscape(name)}<br>(@${htmlEscape(feedItem.authorHandle)})`,
  ),
);

const sourceIcons: Record<ActivityPubMentionPublishedFeedItem['source'], string> = {
  Bonfire: '<img class="activity-feed-item__source-icon activity-feed-item__source-icon--bonfire" src="/static/images/bonfire-social-icon.svg" alt="">',
  Mastodon: '<span class="activity-feed-item__source-icon activity-feed-item__source-icon--mastodon" aria-hidden="true"></span>',
};

type RenderActivityPubMentionPublishedFeedItem = (feedItem: ActivityPubMentionPublishedFeedItem) => HtmlFragment;

export const renderActivityPubMentionPublishedFeedItem: RenderActivityPubMentionPublishedFeedItem = (
  feedItem,
) => toHtmlFragment(`
  <div class="activity-feed-item-contents activity-feed-item-contents--activitypub-mention">
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
      ${feedItem.content}
    </div>
  </div>
`);
