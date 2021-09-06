import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { PageView } from './page-view';

export type Session = {
  visitorId: string,
  pageViews: ReadonlyArray<PageView>,
};

type Chunks = ReadonlyArray<ReadonlyArray<PageView>>;

const postToCorrectSubsession = (accum: Chunks, pv: PageView): Chunks => pipe(
  [accum[0].concat(pv)],
);

export const split = (s: Session): ReadonlyArray<Session> => pipe(
  s.pageViews,
  RA.reduce([[]], postToCorrectSubsession),
  RA.map((pageViews) => ({
    visitorId: s.visitorId,
    pageViews,
  })),
);
