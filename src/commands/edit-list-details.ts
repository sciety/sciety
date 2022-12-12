import * as t from 'io-ts';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { userGeneratedInputCodec } from '../types/codecs/user-generated-input-codec';

export const editListDetailsCommandCodec = t.type({
  name: userGeneratedInputCodec(100),
  description: userGeneratedInputCodec(250),
  listId: ListIdFromString,
});

export type EditListDetailsCommand = t.TypeOf<typeof editListDetailsCommandCodec>;
