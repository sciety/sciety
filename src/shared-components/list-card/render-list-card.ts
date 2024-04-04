import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { templateDate } from '../date';
import { renderListPageLinkHref } from '../render-list-page-link-href';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';
import { RawUserInput } from '../../read-side';
import { safelyRenderRawUserInput } from '../raw-user-input-renderers';

type Curator = {
  avatarUrl: string,
  name: string,
};

export type ListCardViewModel = {
  listId: ListId,
  articleCount: number,
  updatedAt: Date,
  title: string,
  description: RawUserInput,
  imageUrl: O.Option<string>,
  curator: O.Option<Curator>,
};

const lastUpdated = (date: Date) => `<span>Last updated ${templateDate(date)}</span>`;

const renderCurator = (viewModel: ListCardViewModel) => pipe(
  viewModel.curator,
  O.match(
    () => '',
    (curator) => `
      <div class="list-card__curator">
        <img class="list-card__avatar" src="${curator.avatarUrl}" alt="" /><span>Curated by ${curator.name}</span>
      </div>
    `,
  ),
);

const renderListImage = O.fold(
  () => '',
  (imgSrc: string) => `<img class="list-card__image" src="${imgSrc}" alt="">`,
);

export const renderListCard = (viewModel: ListCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="list-card">
    <div class="list-card__body">
      <div>
        <h3 class="list-card__title"><a href="${renderListPageLinkHref(viewModel.listId)}" class="list-card__link">${htmlEscape(viewModel.title)}</a></h3>
        <p>${safelyRenderRawUserInput(viewModel.description)}</p>
      </div>
      ${renderCurator(viewModel)}
      <div class="list-card__meta">
        <span class="visually-hidden">This list contains </span><span>${renderCountWithDescriptor(viewModel.articleCount, 'article', 'articles')}</span>${lastUpdated(viewModel.updatedAt)}
      </div>
    </div>
    ${renderListImage(viewModel.imageUrl)}
  </article>
`);
