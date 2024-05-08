import * as t from 'io-ts';
import { articleIdCodec } from '../../../types/article-id';
import { listIdCodec } from '../../../types/list-id';
import { rawUserInputCodec } from '../../../read-side/raw-user-input';

export const articleIdFieldName = 'articleid';

const userInvisibleFormFieldsCodec = t.strict({
  [articleIdFieldName]: articleIdCodec,
  listId: listIdCodec,
});

export const userEditableFormFieldsCodec = t.strict({
  annotation: rawUserInputCodec,
});

export const saveArticleFormBodyCodec = t.intersection([userInvisibleFormFieldsCodec, userEditableFormFieldsCodec], 'saveArticleFormBodyCodec');

export type FormBody = t.TypeOf<typeof saveArticleFormBodyCodec>;
