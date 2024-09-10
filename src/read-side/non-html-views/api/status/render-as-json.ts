import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../../types/article-id';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

type StatusDataRecord = {
  readonly [key: string]: StatusData,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type StatusDataArray = {} & ReadonlyArray<StatusData>;

type JsonFriendlyScalar = boolean | number | string | null;

export type StatusData = JsonFriendlyScalar | StatusDataArray | StatusDataRecord | ArticleId | URL;

const replacer = (_key: string, value: StatusData): JsonFriendlyScalar | StatusDataRecord | StatusDataArray => {
  if (value instanceof ArticleId) {
    return value.value;
  }
  if (value instanceof URL) {
    return value.href;
  }
  return value;
};

export const renderAsJson = (viewModel: StatusData): NonHtmlViewRepresentation => pipe(
  viewModel,
  (object) => JSON.stringify(object, replacer),
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
