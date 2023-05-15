import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { Doi } from '../../../types/doi';
import { ListOwnerId } from '../../../types/list-owner-id';
import { Logger } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';
import { ViewModel } from '../view-model';

export type Ports = Pick<Queries, 'getGroup' | 'lookupUser' | 'selectAllListsContainingArticle'> & {
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

export const constructListedIn = (ports: Ports) => (articleId: Doi): ViewModel['listedIn'] => pipe(
  articleId,
  ports.selectAllListsContainingArticle,
  RA.map((list) => ({
    listId: list.id,
    listName: list.name,
    listOwnerName: getListOwnerName(ports)(list.ownerId),
  })),
);
