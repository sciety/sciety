import { Json } from 'fp-ts/Json';

export type NonHtmlViewRepresentation = {
  state: Json,
};

export const toNonHtmlViewRepresentation = (state: NonHtmlViewRepresentation['state']): NonHtmlViewRepresentation => ({ state });
