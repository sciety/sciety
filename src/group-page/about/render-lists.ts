import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderLists = (listViewModels: ReadonlyArray<ListCardViewModel>): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return pipe(
      listViewModels,
      RA.map((viewModel) => `<li>${viewModel.title}</li>`),
      (fragments) => fragments.join(''),
      (slimlineCards) => `<ul>${slimlineCards}</ul>`,
      toHtmlFragment,
    );
  }

  return toHtmlFragment('');
};
