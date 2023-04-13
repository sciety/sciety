import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import * as LOID from '../../types/list-owner-id';
import { GetNonEmptyUserLists } from '../../shared-ports';
import { userIdCodec } from '../../types/user-id';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';

export const getNonEmptyUserLists = (
  readModel: ReadModel,
): GetNonEmptyUserLists => () => pipe(
  '1295307136415735808',
  userIdCodec.decode,
  E.getOrElseW(() => { throw new Error(); }),
  LOID.fromUserId,
  selectAllListsOwnedBy(readModel),
);
