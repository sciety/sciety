import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FetchGoogleSheet } from './fetch-google-sheet';
import { FetchEvaluations } from './update-all';

type Ports = {
  fetchGoogleSheet: FetchGoogleSheet,
};

const reviewFromRow = flow(
  RA.map(String),
  (row) => ({
    date: RA.lookup(18)(row),
    link: RA.lookup(6)(row),
    id: RA.lookup(0)(row),
    journal: RA.lookup(14)(row),
  }),
  sequenceS(O.Apply),
);

export const fetchNcrcEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchGoogleSheet('1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA', 'Sheet1!A2:S'),
  TE.chainEitherK(flow(
    (res) => res?.data?.values,
    O.fromNullable,
    O.map(flow(
      RA.map(reviewFromRow),
      RA.compact,
      RA.filter((row) => /(biorxiv|medrxiv)/i.test(row.journal)),
    )),
    E.fromOption(() => 'Values not provided'),
  )),
  TE.map(RA.map((ncrcReview) => {
    const [, doiSuffix] = new RegExp('.*/([^/]*)$').exec(ncrcReview.link) ?? [];
    return {
      date: new Date(ncrcReview.date),
      articleDoi: `10.1101/${doiSuffix}`,
      evaluationLocator: `ncrc:${ncrcReview.id}`,
    };
  })),
  TE.map((evaluations) => ({
    evaluations,
    skippedItems: O.none,
  })),
);
