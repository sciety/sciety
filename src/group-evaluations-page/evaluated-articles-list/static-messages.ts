import { toHtmlFragment } from '../../types/html-fragment';

export const noEvaluatedArticlesMessage = toHtmlFragment('<p class="evaluated-articles__empty">It looks like this group hasn’t evaluated any articles yet. Try coming back later!</p>');

export const noArticlesCanBeFetchedMessage = toHtmlFragment('<p class="static-message">This information can\'t be fetched right now. Please try again later.</p>');
