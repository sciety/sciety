import * as t from 'io-ts';
import { inputFieldNames } from '../../standards';
import { expressionDoiCodec } from '../../types/expression-doi';
import { listIdCodec } from '../../types/list-id';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const annotateArticleInListCommandCodec = t.type({
  [inputFieldNames.annotationContent]: unsafeUserInputCodec,
  [inputFieldNames.expressionDoi]: expressionDoiCodec,
  [inputFieldNames.listId]: listIdCodec,
}, 'annotateArticleInListCommandCodec');

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
