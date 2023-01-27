import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderDescription } from './render-description';
import { OurListsViewModel, renderOurLists } from './render-our-lists';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { FetchStaticFile } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ContentModel } from '../content-model';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
};

export type AboutTabViewModel = {
  lists: OurListsViewModel,
  markdown: string,
};

export const constructAboutTab = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, AboutTabViewModel> => pipe(
  {
    lists: pipe(
      contentModel.lists,
      toOurListsViewModel(contentModel.group.slug),
      TE.right,
    ),
    markdown: ports.fetchStaticFile(`groups/${contentModel.group.descriptionPath}`),
  },
  sequenceS(TE.ApplyPar),
);

const renderAboutTab = (viewmodel: AboutTabViewModel) => toHtmlFragment(`
  <div class="group-page-about">
    <section>
      ${renderOurLists(viewmodel.lists)}
    </section>
    <section>
      ${renderDescription(viewmodel.markdown)}
    </section>
  </div>
`);

export const about = (ports: Ports) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  contentModel,
  constructAboutTab(ports),
  TE.map(renderAboutTab),
);
