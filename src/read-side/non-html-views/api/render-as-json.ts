import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ArticleId } from '../../../types/article-id';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../non-html-view-representation';

type ApiViewModelRecord = {
  readonly [key: string]: ApiViewModel,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type ApiViewModelArray = {} & ReadonlyArray<ApiViewModel>;

type JsonFriendlyScalar = boolean | number | string | null;

// likely defining a new type, rather than an alias to O.Option, to avoid `Type alias circularly references itself`
type ApiViewModelOption = O.None | O.Some<JsonFriendlyScalar | ApiViewModelRecord | ApiViewModelArray>;

export type ApiViewModel = JsonFriendlyScalar | ApiViewModelArray | ApiViewModelRecord | ApiViewModelOption
| ArticleId | URL;

const replacer = (_key: string, value: ApiViewModel): JsonFriendlyScalar | ApiViewModelRecord | ApiViewModelArray => {
  if (value instanceof ArticleId) {
    return value.value;
  }
  if (value instanceof URL) {
    return value.href;
  }
  if (tt.optionFromNullable(t.unknown).is(value)) {
    if (O.isSome(value)) {
      return value.value;
    }
    return null;
  }
  return value;
};

export const renderAsJson = (viewModel: ApiViewModel): NonHtmlViewRepresentation => pipe(
  viewModel,
  (object) => JSON.stringify(object, replacer),
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
