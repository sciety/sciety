import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { GroupCardViewModel } from './view-model';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { templateDate } from '../date';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: GroupCardViewModel['evaluationCount']): HtmlFragment => pipe(
  renderCountWithDescriptor(evaluationCount, 'evaluation', 'evaluations'),
  wrapInSpan,
);

const renderCuratedArticlesCount = (articleCount: GroupCardViewModel['curatedArticlesCount']) => (
  (articleCount === 0)
    ? ''
    : pipe(
      renderCountWithDescriptor(articleCount, 'curated article', 'curated articles'),
      wrapInSpan,
    )
);

const renderListCount = (listCount: GroupCardViewModel['listCount']) => pipe(
  renderCountWithDescriptor(listCount, 'list', 'lists'),
  wrapInSpan,
);

const renderFollowerCount = (followerCount: GroupCardViewModel['followerCount']): HtmlFragment => pipe(
  renderCountWithDescriptor(followerCount, 'follower', 'followers'),
  wrapInSpan,
);

const renderLatestActivity = (latestActivity: GroupCardViewModel['latestActivityAt']): HtmlFragment => pipe(
  latestActivity,
  O.match(
    () => toHtmlFragment(''),
    flow(
      templateDate,
      (text) => `Latest activity ${text}`,
      wrapInSpan,
    ),
  ),
);

export const renderGroupCard = (viewModel: GroupCardViewModel): HtmlFragment => pipe(
  [
    renderEvaluationCount(viewModel.evaluationCount),
    renderCuratedArticlesCount(viewModel.curatedArticlesCount),
    renderListCount(viewModel.listCount),
    renderFollowerCount(viewModel.followerCount),
    renderLatestActivity(viewModel.latestActivityAt),
  ].join(''),
  (meta) => `
    <article class="group-card">
        <div class="group-card__body">
          <h3 class="group-card__title">
            <a class="group-card__link" href="${viewModel.groupPageHref}">${htmlEscape(viewModel.name)}</a>
          </h3>
          <div class="group-card__description">
            ${viewModel.description}
          </div>
          <span class="group-card__meta">
            <span class="visually-hidden">This group has </span>${meta}
          </span>
        </div>
        <img class="group-card__avatar" src="${viewModel.avatarSrc}" alt="" />
    </article>
  `,
  toHtmlFragment,
);
