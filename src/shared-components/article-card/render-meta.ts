import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';
import { templateDate } from '../date';
import { ViewModel } from './view-model';

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: ViewModel['evaluationCount']) => pipe(
  evaluationCount,
  O.fold(
    () => '<span class="visually-hidden">This article has no evaluations</span>',
    (count) => pipe(
      renderCountWithDescriptor(count, 'evaluation', 'evaluations'),
      wrapInSpan,
      (content) => `<span class="visually-hidden">This article has </span>${content}`,
    ),
  ),
);

const renderListMembershipCount = (listMembershipCount: ViewModel['listMembershipCount']) => pipe(
  listMembershipCount,
  O.fold(
    constant(''),
    (count) => pipe(
      `Appears in ${renderCountWithDescriptor(count, 'list', 'lists')}`,
      wrapInSpan,
    ),
  ),
);

const renderPublicationDateOfMostRecentExpression = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest version ${date}`,
    wrapInSpan,
  ),
);

const renderArticleLatestActivityDate = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest activity ${date}`,
    wrapInSpan,
  ),
);

export const renderMeta = (model: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-card__meta">
    ${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderPublicationDateOfMostRecentExpression(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityAt)}
  </div>
`);
