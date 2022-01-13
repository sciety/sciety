import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FetchGoogleSheet } from './fetch-google-sheet';
import { supportedArticleIdFromLink } from './supported-article-id-from-link';
import { FetchEvaluations } from './update-all';
import { sheetId } from '../third-parties/ncrc/sheet-id';

type Ports = {
  fetchGoogleSheet: FetchGoogleSheet,
};

type NcrcReview = {
  date: string,
  articleDoi: string,
  id: string,
  journal: string,
};

const toEvaluation = (ncrcReview: NcrcReview) => ({
  date: new Date(ncrcReview.date),
  articleDoi: ncrcReview.articleDoi,
  evaluationLocator: `ncrc:${ncrcReview.id}`,
  authors: [],
});

const isValidEvaluation = (i: number, data: ReadonlyArray<unknown>) => pipe(
  data,
  RA.map(String),
  (row) => ({
    date: RA.lookup(18)(row),
    link: RA.lookup(6)(row),
    id: RA.lookup(0)(row),
    journal: RA.lookup(14)(row),
  }),
  sequenceS(O.Apply),
  E.fromOption(() => ({ item: `row ${i}`, reason: 'missing data' })),
  E.filterOrElse(
    (r) => /(biorxiv|medrxiv)/i.test(r.journal),
    (r) => ({ item: r.id, reason: 'not a biorxiv | medrxiv article' }),
  ),
  E.chain((r) => pipe(
    supportedArticleIdFromLink(r.link),
    E.bimap(
      (reason) => ({ item: r.id, reason }),
      (articleDoi) => ({
        ...r,
        articleDoi,
      }),
    ),
  )),
);

export const fetchNcrcEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchGoogleSheet(sheetId, 'Sheet1!A2:S'),
  TE.chainEitherK(flow(
    (res) => res?.data?.values,
    E.fromNullable('.values not provided'),
  )),
  TE.map(flow(
    RA.partitionMapWithIndex(isValidEvaluation),
    ({ left, right }) => ({
      evaluations: pipe(
        right,
        RA.map(toEvaluation),
      ),
      skippedItems: left,
    }),
  )),
);
