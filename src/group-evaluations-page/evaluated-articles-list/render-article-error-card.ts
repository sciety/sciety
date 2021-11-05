import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderArticleErrorCard = (): HtmlFragment => (
  toHtmlFragment('<div class="error-card">Can\'t currently display this article.</div>')
);
