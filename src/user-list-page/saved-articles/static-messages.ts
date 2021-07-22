import { toHtmlFragment } from '../../types/html-fragment';

export const informationUnavailable = toHtmlFragment(
  '<p class="static-message">We couldn\'t find this information; please try again later.</p>',
);

export const noSavedArticles = toHtmlFragment(
  '<p class="static-message">This user has no saved articles.</p>',
);
