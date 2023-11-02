import * as t from 'io-ts';
import { DoiFromString } from './codecs/DoiFromString';
import { listIdCodec } from './list-id';

export const annotationTargetCodec = t.type({
  articleId: DoiFromString,
  listId: listIdCodec,
});
