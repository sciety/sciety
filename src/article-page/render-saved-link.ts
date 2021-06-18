import { flow } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

const templateSavedLink = (userId: UserId) => `
  <a class="saved-to-list" href="/users/${userId}/saved-articles">
    <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
    Saved to my list
  </a>
`;

export const renderSavedLink = flow(
  templateSavedLink,
  toHtmlFragment,
);
