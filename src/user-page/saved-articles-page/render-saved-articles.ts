import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const templateListItems = (items: ReadonlyArray<HtmlFragment>, itemClass = 'item'): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment) => `<li class="${itemClass}">${item}</li>\n`)
      .join(''),
  )
);

export const renderSavedArticles = (list: ReadonlyArray<HtmlFragment>) => toHtmlFragment(`
      <ol class="saved-articles" role="list">
        ${templateListItems(list, 'saved-articles__item')}
      </ol>
`);
