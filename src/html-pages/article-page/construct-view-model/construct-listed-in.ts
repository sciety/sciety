import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { SelectAllListsContainingArticle } from '../../../shared-ports/select-all-lists-containing-article';
import { Doi } from '../../../types/doi';
import { ListOwnerId } from '../../../types/list-owner-id';
import { GetGroup, Logger, LookupUser } from '../../../shared-ports';

export type Ports = {
  selectAllListsContainingArticle: SelectAllListsContainingArticle,
  getGroup: GetGroup,
  lookupUser: LookupUser,
  logger: Logger,
};

const getListOwnerName = (ports: Ports) => (ownerId: ListOwnerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        ports.getGroup,
        O.match(
          () => {
            ports.logger('error', 'Consistency error in article page: Failed to get list owner', { ownerId });
            return 'A group';
          },
          (group) => group.name,
        ),
      );

    case 'user-id':
      return pipe(
        ownerId.value,
        ports.lookupUser,
        O.match(
          () => {
            ports.logger('error', 'Consistency error in article page: Failed to get list owner', { ownerId });
            return 'A user';
          },
          (user) => user.handle,
        ),
      );
  }
};

export const constructListedIn = (ports: Ports) => (articleId: Doi) => pipe(
  articleId,
  ports.selectAllListsContainingArticle,
  RA.map((list) => ({
    listId: list.id,
    listName: list.name,
    listOwnerName: getListOwnerName(ports)(list.ownerId),
  })),
);
