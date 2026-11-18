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
    (src) => `<img class="activity-feed__item__avatar" src="${htmlEscape(src)}" alt="">`,
  ),
);

const renderAuthor = (feedItem: ActivityPubMentionPublishedFeedItem) => pipe(
  feedItem.authorName,
  O.match(
    () => `@${htmlEscape(feedItem.authorHandle)}`,
    (name) => `${htmlEscape(name)}<br>(@${htmlEscape(feedItem.authorHandle)})`,
  ),
);

type RenderActivityPubMentionPublishedFeedItem = (feedItem: ActivityPubMentionPublishedFeedItem) => HtmlFragment;

export const renderActivityPubMentionPublishedFeedItem: RenderActivityPubMentionPublishedFeedItem = (
  feedItem,
) => toHtmlFragment(`
  <div class="activity-feed__item__contents activity-feed__item__contents--activitypub-mention">
    <header class="activity-feed__item__header">
      ${renderAvatar(feedItem.authorAvatarUrl)}
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${htmlEscape(feedItem.href)}">
            ${renderAuthor(feedItem)} via ${htmlEscape(feedItem.source)}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
    <div class="activity-feed__item__body">
      ${feedItem.content}
    </div>
  </div>
`);
