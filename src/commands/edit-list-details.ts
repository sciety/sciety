import * as t from 'io-ts';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { userGeneratedInputCodec } from '../types/codecs/user-generated-input-codec';

export const listNameMaxLength = 100;
export const listDescriptionMaxLength = 250;

export const editListDetailsCommandCodec = t.type({
  name: userGeneratedInputCodec(listNameMaxLength),
  description: userGeneratedInputCodec(listDescriptionMaxLength),
  listId: ListIdFromString,
});

export type EditListDetailsCommand = t.TypeOf<typeof editListDetailsCommandCodec>;
