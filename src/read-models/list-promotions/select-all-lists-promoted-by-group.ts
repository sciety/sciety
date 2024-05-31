/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReadModel } from './handle-event';
import { RawUserInput } from '../../read-side';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';
import { ListEntry } from '../lists/list';

type PromotedList = {
  id: ListId,
  name: string,
  description: RawUserInput,
  entries: ReadonlyArray<ListEntry>,
  updatedAt: Date,
  ownerId: ListOwnerId,
};

export const selectAllListsPromotedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<PromotedList> => [];
