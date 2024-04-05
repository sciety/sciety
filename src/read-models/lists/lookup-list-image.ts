import * as O from 'fp-ts/Option';
import * as LID from '../../types/list-id';

export const lookupListImage = (listId: LID.ListId): O.Option<string> => {
  if (listId === '729cab51-b47d-4ab5-bf2f-8282f1de445e') {
    return O.some('/static/images/collections/endorsed-by-gigabyte.png');
  }
  if (listId === '454ba80f-e0bc-47ed-ba76-c8f872c303d2') {
    return O.some('/static/images/collections/biophysics-colab-collection-1.png');
  }
  return O.none;
};
