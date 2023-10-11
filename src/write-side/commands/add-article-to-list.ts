import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { annotationContentCodec } from './annotation-content-codec';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    articleId: DoiFromString,
    listId: listIdCodec,
  }),
  t.partial({
    annotation: annotationContentCodec,
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
