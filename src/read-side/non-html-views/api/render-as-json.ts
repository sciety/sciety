import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../types/article-id';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../non-html-view-representation';

type ApiDataRecord = {
  readonly [key: string]: ApiData,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type ApiDataArray = {} & ReadonlyArray<ApiData>;

type JsonFriendlyScalar = boolean | number | string | null;

export type ApiData = JsonFriendlyScalar | ApiDataArray | ApiDataRecord | ArticleId | URL;

const replacer = (_key: string, value: ApiData): JsonFriendlyScalar | ApiDataRecord | ApiDataArray => {
  if (value instanceof ArticleId) {
    return value.value;
  }
  if (value instanceof URL) {
    return value.href;
  }
  return value;
};

export const renderAsJson = (viewModel: ApiData): NonHtmlViewRepresentation => pipe(
  viewModel,
  (object) => JSON.stringify(object, replacer),
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
