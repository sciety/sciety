import { toHtmlFragment } from '../../types/html-fragment';

export const noEvaluatedArticles = toHtmlFragment('<p class="evaluated-articles__empty">It looks like this group hasn’t evaluated any articles yet. Try coming back later!</p>');

export const articleDetailsUnavailable = toHtmlFragment('<p class="static-message">This information can not be found.</p>');
