import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { templateDate } from '../../../../shared-components/date';
import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: ViewModel['evaluationCount']) => pipe(
  evaluationCount,
  O.match(
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
  O.match(
    constant(''),
    (count) => pipe(
      `Appears in ${renderCountWithDescriptor(count, 'list', 'lists')}`,
      wrapInSpan,
    ),
  ),
);

const renderLatestPublicationDate = flow(
  templateDate,
  (date) => `Latest version ${date}`,
  wrapInSpan,
);

const renderArticleLatestActivityDate = O.match(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest activity ${date}`,
    wrapInSpan,
  ),
);

export const renderMeta = (model: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-card__meta">
    ${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderLatestPublicationDate(model.latestPublishedAt)}${renderArticleLatestActivityDate(model.latestActivityAt)}
  </div>
`);
