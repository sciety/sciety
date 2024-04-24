import { pipe } from 'fp-ts/function';
import { renderDescription } from './render-description';
import { renderOurLists } from './render-our-lists';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  `
    <section>
      ${renderOurLists(viewmodel.ourLists)}
    </section>
    <section>
      ${renderDescription(viewmodel.markdown)}
    </section>
  `,
  toHtmlFragment,
);
