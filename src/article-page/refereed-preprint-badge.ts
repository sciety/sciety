import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { shouldDisplayRefereedBadge } from './should-display-refereed-badge';
import { DomainEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const refereedPreprintBadge = (articleId: Doi) => (events: ReadonlyArray<DomainEvent>): HtmlFragment => pipe(
  events,
  shouldDisplayRefereedBadge(articleId),
  B.fold(
    () => '',
    () => '<div class="badge">Refereed preprint</div>',
  ),
  toHtmlFragment,
);
