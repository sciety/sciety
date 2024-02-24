import { HtmlFragment, toHtmlFragment } from '../types/html-fragment.js';

export const supplementaryCard = (title: string, content: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <article class="supplementary-card">
    <h2 class="supplementary-card__title">${title}</h2>
    ${content}
  </article>
`);
