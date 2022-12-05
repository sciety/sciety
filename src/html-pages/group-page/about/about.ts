import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderOurLists } from './render-our-lists';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { SelectAllListsOwnedBy } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { Group } from '../../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import * as LOID from '../../../types/list-owner-id';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const getRenderedLists = (ports: Ports) => (group: Group) => pipe(
  group.id,
  LOID.fromGroupId,
  ports.selectAllListsOwnedBy,
  TE.right,
  TE.map(toOurListsViewModel(group.slug)),
  TE.map(renderOurLists),
);

const getRenderedDescription = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  `groups/${group.descriptionPath}`,
  ports.fetchStaticFile,
  TE.map(renderDescription),
);

export const about = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    lists: getRenderedLists(ports)(group),
    description: getRenderedDescription(ports)(group),
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
