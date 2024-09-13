import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ArticleId } from '../../../../types/article-id';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

type StatusDataRecord = {
  readonly [key: string]: StatusData,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type StatusDataArray = {} & ReadonlyArray<StatusData>;

type OptionOfString = O.Option<string>;

type OptionOfRecord = O.Option<StatusDataRecord>;

type JsonFriendlyScalar = boolean | number | string | null;

export type StatusData = JsonFriendlyScalar | StatusDataArray | StatusDataRecord
| ArticleId | URL | OptionOfString | OptionOfRecord;

const replacer = (_key: string, value: StatusData): JsonFriendlyScalar | StatusDataRecord | StatusDataArray => {
  if (value instanceof ArticleId) {
    return value.value;
  }
  if (value instanceof URL) {
    return value.href;
  }
  if (tt.optionFromNullable(t.string).is(value)) {
    if (O.isSome(value)) {
      return value.value;
    }
    return null;
  }
  if (tt.optionFromNullable(t.unknown).is(value)) {
    if (O.isSome(value)) {
      return value.value;
    }
    return null;
  }
  return value;
};

export const renderAsJson = (viewModel: StatusData): NonHtmlViewRepresentation => pipe(
  viewModel,
  (object) => JSON.stringify(object, replacer),
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
