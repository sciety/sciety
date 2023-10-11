import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { annotationContentCodec } from './annotation-content-codec';
import { externalInputFieldNames } from '../../standards';

export const annotateArticleInListCommandCodec = t.type({
  [externalInputFieldNames.content]: annotationContentCodec,
  [externalInputFieldNames.articleId]: DoiFromString,
  [externalInputFieldNames.listId]: listIdCodec,
});

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
