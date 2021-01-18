import { flow } from 'fp-ts/lib/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderSavedLink = (userId: UserId) => HtmlFragment;

const templateSavedLink = (userId: UserId): string => `
  <a class="saved-to-list" href="/users/${userId}#saved-articles">
    <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
    Saved to my list
  </a>
`;

export const renderSavedLink: RenderSavedLink = flow(
  templateSavedLink,
  toHtmlFragment,
);
