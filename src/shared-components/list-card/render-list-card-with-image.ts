import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { templateDate } from '../date';
import { renderListPageLinkHref } from '../render-list-page-link-href';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';
import { safelyRenderRawUserInput } from '../raw-user-input-renderers';
import { ListCardViewModel } from './render-list-card';

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

const renderAvatar = O.fold(
  () => '',
  (avatarUrl: string) => `<img class="list-card__avatar" src="${avatarUrl}" alt="" />`,
);

const renderListImage = O.fold(
  () => '',
  (imgSrc: string) => `<img src="${imgSrc}" alt="">`,
);

export const renderListCardWithImage = (viewModel: ListCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="list-card">
    <div class="list-card__body">
      <div>
        <h3 class="list-card__title"><a href="${renderListPageLinkHref(viewModel.listId)}" class="list-card__link">${htmlEscape(viewModel.title)}</a></h3>
        <p>${safelyRenderRawUserInput(viewModel.description)}</p>
      </div>
      <div class="list-card__meta">
        <span class="visually-hidden">This list contains </span><span>${renderCountWithDescriptor(viewModel.articleCount, 'article', 'articles')}</span>${lastUpdated(viewModel.updatedAt)}
      </div>
    </div>
    ${renderListImage(process.env.EXPERIMENT_ENABLED === 'true' ? O.some('/static/images/collections/endorsed-by-gigabyte.png') : O.none)}
    ${renderAvatar(viewModel.avatarUrl)}
  </article>
`);
