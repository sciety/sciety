import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as LOID from '../../types/list-owner-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { ListCardViewModel, renderListCard } from '../../shared-components/list-card/render-list-card';
import { userIdCodec } from '../../types/user-id';
import { SelectAllListsOwnedBy } from '../../shared-ports';
import { templateListItems } from '../../shared-components/list-items';

type ViewModel = ReadonlyArray<ListCardViewModel>;

type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructViewModel = (ports: Ports) => pipe(
  '1295307136415735808',
  userIdCodec.decode,
  E.getOrElseW(() => { throw new Error(); }),
  LOID.fromUserId,
  ports.selectAllListsOwnedBy,
  RA.map((list) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    articleCountLabel: 'This list contains',
  })),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Most active user lists',
  content: pipe(
    viewModel,
    RA.map(renderListCard),
    templateListItems,
    (listCards) => `<ol role="list">${listCards}</ol>`,
    toHtmlFragment,
  ),
});

type ListOfUserListsPage = TE.TaskEither<RenderPageError, Page>;

export const listOfUserListsPage = (ports: Ports): ListOfUserListsPage => pipe(
  constructViewModel(ports),
  renderAsHtml,
  TE.right,
);
