import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { FetchStaticFile } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ContentModel } from '../content-model';
import { renderOurLists } from '../render-as-html/render-our-lists';
import { renderDescription } from '../render-as-html/render-description';
import { AboutTab } from '../view-model';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
};

export const constructAboutTab = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, AboutTab> => pipe(
  {
    selector: TE.right('about' as const),
    lists: pipe(
      contentModel.lists,
      toOurListsViewModel(contentModel.group.slug),
      TE.right,
    ),
    markdown: ports.fetchStaticFile(`groups/${contentModel.group.descriptionPath}`),
  },
  sequenceS(TE.ApplyPar),
);

export const renderAboutTab = (viewmodel: AboutTab): HtmlFragment => toHtmlFragment(`
  <div class="group-page-about">
    <section>
      ${renderOurLists(viewmodel.lists)}
    </section>
    <section>
      ${renderDescription(viewmodel.markdown)}
    </section>
  </div>
`);
