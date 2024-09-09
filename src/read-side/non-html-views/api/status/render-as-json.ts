import { pipe } from 'fp-ts/function';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

type JsonRecord = {
  readonly [key: string]: StatusData,
};

// eslint-disable-next-line @typescript-eslint/ban-types
type JsonArray = {} & ReadonlyArray<StatusData>;

type StatusData = boolean | number | string | null | JsonArray | JsonRecord;

export const renderAsJson = (viewModel: StatusData): NonHtmlViewRepresentation => pipe(
  viewModel,
  JSON.stringify,
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
