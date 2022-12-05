import * as t from 'io-ts';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { stringFromRegexCodec } from '../types/codecs/string-from-regex-codec';

export const editListDetailsCommandCodec = t.type({
  name: stringFromRegexCodec,
  description: stringFromRegexCodec,
  listId: ListIdFromString,
});

export type EditListDetailsCommand = t.TypeOf<typeof editListDetailsCommandCodec>;
