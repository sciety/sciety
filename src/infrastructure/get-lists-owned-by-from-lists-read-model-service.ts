import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { fetchData } from './fetchers';
import { Logger } from './logger';
import { List } from '../shared-read-models/lists';
import { OwnedByQuery } from '../types/codecs/OwnedByQuery';
import * as DE from '../types/data-error';
import { ListOwnerId } from '../types/list-owner-id';
import * as LOID from '../types/list-owner-id';

type GetListsOwnedByFromListsReadModelService = (logger: Logger, listsReadModelUri: string) => (ownerId: ListOwnerId)
=> TE.TaskEither<DE.DataError, ReadonlyArray<List>>;

export const getListsOwnedByFromListsReadModelService: GetListsOwnedByFromListsReadModelService = (
  logger,
  listsReadModelUri,
) => (
  ownerId,
) => pipe(
  TE.tryCatch(
    async () => {
      const uri = `${listsReadModelUri}/owned-by/${LOID.fromStringCodec.encode(ownerId)}`;
      const response = await fetchData(logger)<string>(uri);
      return response.data;
    },
    (error) => {
      logger('error', 'Failed to call lists read model', { error });
      return DE.unavailable;
    },
  ),
  TE.chainEitherKW(flow(
    OwnedByQuery.decode,
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
