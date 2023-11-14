import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { externalInputFieldNames } from '../../standards';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const annotateArticleInListCommandCodec = t.type({
  [externalInputFieldNames.content]: unsafeUserInputCodec,
  [externalInputFieldNames.articleId]: DoiFromString,
  [externalInputFieldNames.listId]: listIdCodec,
});

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
