import { toHtmlFragment } from '../types/html-fragment';

export const informationUnavailable = toHtmlFragment(
  '<p class="static-message">We couldn\'t find this information; please try again later.</p>',
);

export const followingNothing = toHtmlFragment(
  '<p class="static-message">This user is currently not following any groups.</p>',
);
