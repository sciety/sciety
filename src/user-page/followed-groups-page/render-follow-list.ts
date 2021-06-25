import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const followingNothing = `
  <p class="followed-groups__no_groups">This user is currently not following any groups.</p>
`;

// TODO: should take a RNEA, but not possible due to traverse array in followList until fp-ts 2.11 / 3.0
const templateListItems = (items: ReadonlyArray<HtmlFragment>, itemClass = 'item'): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment) => `<li class="${itemClass}">${item}</li>\n`)
      .join(''),
  )
);

export const renderFollowList = (list: ReadonlyArray<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <ol class="followed-groups__list" role="list">
    ${templateListItems(list, 'followed-groups__item')}
  </ol>
`);
