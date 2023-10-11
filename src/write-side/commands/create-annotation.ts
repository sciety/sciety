import * as t from 'io-ts';
import { HtmlFragment } from '../../types/html-fragment';
import { userGeneratedInputCodec } from '../../types/user-generated-input';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { ListId, listIdCodec } from '../../types/list-id';
import { ArticleId } from '../../types/article-id';

export const createAnnotationCommandCodec = t.type({
  content: userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: false }),
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  articleId: ArticleId,
  listId: ListId,
};
