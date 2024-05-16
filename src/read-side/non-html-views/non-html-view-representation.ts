import { Json } from 'fp-ts/Json';
import { HtmlFragment } from '../../types/html-fragment';

export type NonHtmlViewRepresentation = {
  state: Json | HtmlFragment,
  mediaType: string,
};

export const toNonHtmlViewRepresentation = (
  state: NonHtmlViewRepresentation['state'],
  mediaType: string,
): NonHtmlViewRepresentation => ({ state, mediaType });
