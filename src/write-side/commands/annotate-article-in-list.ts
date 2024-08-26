import * as t from 'io-ts';
import { inputFieldNames } from '../../standards';
import { canonicalExpressionDoiCodec } from '../../types/expression-doi';
import { listIdCodec } from '../../types/list-id';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const annotateArticleInListCommandCodec = t.type({
  [inputFieldNames.annotationContent]: unsafeUserInputCodec,
  [inputFieldNames.expressionDoi]: canonicalExpressionDoiCodec,
  [inputFieldNames.listId]: listIdCodec,
}, 'annotateArticleInListCommandCodec');

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
