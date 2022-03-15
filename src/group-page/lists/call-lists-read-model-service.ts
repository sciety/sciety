import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { fetchData } from '../../infrastructure/fetchers';
import { Logger } from '../../infrastructure/logger';
import { List } from '../../shared-read-models/lists';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { ListIdFromString } from '../../types/codecs/ListIdFromString';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';

const ownedByQueryCodec = t.type({
  items: t.readonlyArray(t.type({
    id: ListIdFromString,
    name: t.string,
    description: t.string,
    articleCount: t.number,
    lastUpdated: tt.DateFromISOString,
    ownerId: GroupIdFromString,
  })),
});

type CallListsReadModelService = (logger: Logger, groupId: GroupId)
=> TE.TaskEither<DE.DataError, ReadonlyArray<List>>;

export const callListsReadModelService: CallListsReadModelService = (logger, groupId) => pipe(
  TE.tryCatch(
    async () => {
      const uri = `http://${process.env.LISTS_READ_MODEL_HOST ?? 'lists'}/owned-by/${groupId}`;
      const response = await fetchData(logger)<string>(uri);
      return response.data;
    },
    (error) => {
      logger('error', 'Failed to call lists read model', { error });
      return DE.unavailable;
    },
  ),
  TE.chainEitherKW(flow(
    ownedByQueryCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((error) => {
      logger('error', 'Failed to decode response from lists read model', { error });
      return DE.unavailable;
    }),
  )),
  TE.map(
    ({ items }) => items,
  ),
);
