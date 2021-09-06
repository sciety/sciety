import { pipe } from 'fp-ts/function';
import { PageView } from './page-view';

export type Session = {
  visitorId: string,
  pageViews: ReadonlyArray<PageView>,
};

export const split = (s: Session): ReadonlyArray<Session> => pipe(
  [s],
);
