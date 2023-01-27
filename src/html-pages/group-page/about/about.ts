import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderDescription } from './render-description';
import { renderOurLists } from './render-our-lists';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { FetchStaticFile } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { Group } from '../../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ContentModel } from '../content-model';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
};

const getRenderedLists = (contentModel: ContentModel) => pipe(
  contentModel.lists,
  TE.right,
  TE.map(toOurListsViewModel(contentModel.group.slug)),
  TE.map(renderOurLists),
);

const getRenderedDescription = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  `groups/${group.descriptionPath}`,
  ports.fetchStaticFile,
  TE.map(renderDescription),
);

export const about = (ports: Ports) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    lists: getRenderedLists(contentModel),
    description: getRenderedDescription(ports)(contentModel.group),
  },
  sequenceS(TE.ApplyPar),
  TE.map(({ lists, description }) => `
    <div class="group-page-about">
      <section>
        ${lists}
      </section>
      <section>
        ${description}
      </section>
    </div>
  `),
  TE.map(toHtmlFragment),
);
