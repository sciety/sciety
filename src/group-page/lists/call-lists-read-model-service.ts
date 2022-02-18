import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchData } from '../../infrastructure/fetchers';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';

type CallListsReadModelService = (logger: Logger, groupId: GroupId) => () => TE.TaskEither<never, void>;

export const callListsReadModelService: CallListsReadModelService = (logger, groupId) => () => pipe(
  TE.tryCatch(
    async () => {
      const uri = `http://${process.env.LISTS_READ_MODEL_HOST ?? 'lists'}/owned-by/${groupId}`;
      const response = await fetchData(logger)<string>(uri);
      return response.data;
    },
    () => DE.unavailable,
  ),
  TE.match(
    () => E.right(undefined),
    () => E.right(undefined),
  ),
);
