import * as t from 'io-ts';
import { inputFieldNames } from '../../standards';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { listIdCodec } from '../../types/list-id';

export const removeListPromotionCommandCodec = t.strict({
  [inputFieldNames.forGroup]: GroupIdFromStringCodec,
  [inputFieldNames.listId]: listIdCodec,
}, 'removeListPromotionCommandCodec');

export type RemoveListPromotionCommand = t.TypeOf<typeof removeListPromotionCommandCodec>;
