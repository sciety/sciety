import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { FetchStaticFile } from '../../../../shared-ports';
import * as DE from '../../../../types/data-error';
import { ContentModel } from '../content-model';
import { AboutTab } from '../view-model';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
};

export const constructAboutTab = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, AboutTab> => pipe(
  {
    ourLists: pipe(
      contentModel.lists,
      toOurListsViewModel(contentModel.group.slug),
      TE.right,
    ),
    markdown: ports.fetchStaticFile(`groups/${contentModel.group.descriptionPath}`),
  },
  sequenceS(TE.ApplyPar),
);
