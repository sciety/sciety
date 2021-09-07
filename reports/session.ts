import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { PageView } from './page-view';

export type Session = {
  visitorId: string,
  pageViews: ReadonlyArray<PageView>,
};

type Chunks = ReadonlyArray<ReadonlyArray<PageView>>;

const postToCorrectSubsession = (accum: Chunks, pv: PageView): Chunks => {
  if (accum[0].length === 0) {
    return [[pv]];
  }
  const currentChunk = accum[accum.length - 1];
  const latestPageView = currentChunk[currentChunk.length - 1];
  if (pv.time_local.getTime() - latestPageView.time_local.getTime() <= 30 * 60 * 1000) {
    let precedingChunks = accum.slice(0, -1);
    if (precedingChunks.length === 0) {
      return [currentChunk.concat([pv])];
    }
    return precedingChunks.concat([currentChunk.concat([pv])]);
  }
  return accum.concat([[pv]]);
};

export const split = (s: Session): ReadonlyArray<Session> => pipe(
  s.pageViews,
  RA.reduce([[]], postToCorrectSubsession),
  RA.map((pageViews) => ({
    visitorId: s.visitorId,
    pageViews,
  })),
);
