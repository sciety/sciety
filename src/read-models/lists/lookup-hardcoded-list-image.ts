import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import * as LID from '../../types/list-id';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const lookupHardcodedListImage = (readModel: ReadModel) => (listId: LID.ListId): O.Option<string> => {
  if (listId === '729cab51-b47d-4ab5-bf2f-8282f1de445e') {
    return O.some('/static/images/lists/endorsed-by-gigabyte.png');
  }
  if (listId === '454ba80f-e0bc-47ed-ba76-c8f872c303d2') {
    return O.some('/static/images/lists/biophysics-colab-list-image-1.png');
  }
  if (listId === '5ac3a439-e5c6-4b15-b109-92928a740812') {
    return O.some('/static/images/lists/biophysics-colab-list-image-curated-articles.png');
  }
  return O.none;
};
