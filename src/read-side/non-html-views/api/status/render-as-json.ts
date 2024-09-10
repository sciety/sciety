import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../../types/article-id';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

type JsonRecord = {
  readonly [key: string]: StatusData,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type JsonArray = {} & ReadonlyArray<StatusData>;

export type StatusData = boolean | number | string | null | JsonArray | JsonRecord | ArticleId | URL;

const replacer = (_key: string, value: unknown): unknown => {
  if (value instanceof ArticleId) {
    return value.value;
  }
  return value;
};

export const renderAsJson = (viewModel: StatusData): NonHtmlViewRepresentation => pipe(
  viewModel,
  (object) => JSON.stringify(object, replacer),
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
