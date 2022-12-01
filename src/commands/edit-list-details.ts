import * as t from 'io-ts';
import { ListIdFromString } from '../types/codecs/ListIdFromString';

export const editListDetailsCommandCodec = t.type({
  name: t.string,
  description: t.string,
  listId: ListIdFromString,
});

export type EditListDetailsCommand = t.TypeOf<typeof editListDetailsCommandCodec>;
