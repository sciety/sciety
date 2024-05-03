import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { renderSuccessBanner } from './render-success-banner';
import { safelyRenderRawUserInput } from '../../../../shared-components/raw-user-input-renderers';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { ViewModel } from '../view-model';

const renderArticleCount = (articleCount: ViewModel['articleCount']) => pipe(
  articleCount === 1,
  (singular) => `<span>${articleCount} ${singular ? 'article' : 'articles'}</span>`,
);

const renderLastUpdated = (date: ViewModel['updatedAt']) => `<span>Last updated ${templateDate(date)}</span>`;

const renderEditDetailsLink = (editCapability: ViewModel['editCapability'], editListDetailsHref: ViewModel['editListDetailsHref']) => pipe(
  editCapability,
  B.fold(
    () => '',
    () => `<a href="${editListDetailsHref}" class="list-page-actions__edit_details_link">Edit list details</a>`,
  ),
);

const renderRelatedArticlesLink = (url: ViewModel['relatedArticlesLink']) => pipe(
  url,
  O.match(
    () => '',
    (u) => `<a class="list-page-actions__related_articles" href="${u}">Related articles (Labs 🧪)</a>`,
  ),
);

const renderSubscribeLink = (subscribeHref: ViewModel['subscribeHref']) => pipe(
  subscribeHref,
  O.match(
    () => '',
    (href) => `<a class="list-page-actions__subscribe" href="${href}">Subscribe</a>`,
  ),
);

const renderListImage = (imageSrc: ViewModel['imageSrc']) => pipe(
  imageSrc,
  O.match(
    () => '',
    (src) => `<img src="${src}" alt="" class="page-header__list_image">`,
  ),
);

const renderFrontMatter = (viewModel: ViewModel) => `
  <div>
    <h1>${htmlEscape(viewModel.name)}</h1>
    <p class="page-header__subheading">
      <img src="${viewModel.ownerAvatarSrc}" alt="" class="page-header__avatar">
      <span>A list by <a href="${viewModel.ownerHref}">${htmlEscape(viewModel.ownerName)}</a></span>
    </p>
    <p class="page-header__description">${safelyRenderRawUserInput(viewModel.description)}</p>
    <p class="page-header__meta"><span class="visually-hidden">This list contains </span>${renderArticleCount(viewModel.articleCount)}${renderLastUpdated(viewModel.updatedAt)}</p>
    <section class="list-page-actions">
      ${renderEditDetailsLink(viewModel.editCapability, viewModel.editListDetailsHref)}
      ${renderRelatedArticlesLink(viewModel.relatedArticlesLink)}
      ${renderSubscribeLink(viewModel.subscribeHref)}
    </section>
  </div>
`;

export const renderHeader = (viewModel: ViewModel): HtmlFragment => pipe(
  `
  ${renderSuccessBanner(viewModel)}
  <header class="page-header page-header--list">
    ${renderFrontMatter(viewModel)} 
    ${renderListImage(viewModel.imageSrc)}
  </header>`,
  toHtmlFragment,
);
