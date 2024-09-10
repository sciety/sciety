import { URL } from 'url';
import { Json } from 'fp-ts/Json';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../../types/article-id';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

type StatusDataRecord = {
  readonly [key: string]: StatusData,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type StatusDataArray = {} & ReadonlyArray<StatusData>;

export type StatusData = boolean | number | string | null | StatusDataArray | StatusDataRecord | ArticleId | URL;

const replacer = (_key: string, value: StatusData): Json | StatusDataRecord | StatusDataArray => {
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
