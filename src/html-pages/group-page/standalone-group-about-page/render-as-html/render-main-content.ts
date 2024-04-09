import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderOurLists } from './render-our-lists';
import { renderDescription } from './render-description';

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
