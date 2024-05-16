import { Json } from 'fp-ts/Json';
import { HtmlFragment } from '../../types/html-fragment';

export type NonHtmlViewRepresentation = {
  state: Json | HtmlFragment,
};

export const toNonHtmlViewRepresentation = (state: NonHtmlViewRepresentation['state']): NonHtmlViewRepresentation => ({ state });
