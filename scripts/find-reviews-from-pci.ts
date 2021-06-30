import fs from 'fs';
import axios from 'axios';
import { printf } from 'fast-printf';
import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { DOMParser } from 'xmldom';

type Evaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

type FetchEvaluations = TE.TaskEither<string, Array<Evaluation>>;

type Group = {
  id: string,
  name: string,
  fetchFeed: FetchEvaluations,
};

const fetchPage = (url: string): TE.TaskEither<string, string> => pipe(
  TE.tryCatch(
    async () => axios.get<string>(url),
    E.toError,
  ),
  TE.bimap(
    (error) => error.toString(),
    (response) => response.data,
  ),
);

const fetchPciEvaluations = (url: string): FetchEvaluations => pipe(
  fetchPage(url),
  TE.map((feed) => {
    const parser = new DOMParser({
      errorHandler: (_, msg) => {
        throw msg;
      },
    });
    const doc = parser.parseFromString(feed, 'text/xml');
    const result = [];
    // eslint-disable-next-line no-loops/no-loops
    for (const link of Array.from(doc.getElementsByTagName('link'))) {
      const articleDoiString = link.getElementsByTagName('doi')[1]?.textContent ?? '';
      const reviewDoiString = link.getElementsByTagName('doi')[0]?.textContent ?? '';
      const date = link.getElementsByTagName('date')[0]?.textContent ?? '';
      const bioAndmedrxivDoiRegex = /^\s*(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.1101\/(?:[^%"#?\s])+)\s*$/;
      const [, articleDoi] = bioAndmedrxivDoiRegex.exec(articleDoiString) ?? [];
      if (articleDoi) {
        const reviewDoi = reviewDoiString.replace('https://doi.org/', '').replace('http://dx.doi.org/', '');
        result.push({
          date: new Date(date),
          articleDoi,
          evaluationLocator: `doi:${reviewDoi}`,
        });
      }
    }
    return result;
  }),
);

const groups: Array<Group> = [
  {
    id: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de',
    name: 'PCI Zoology',
    fetchFeed: fetchPciEvaluations('https://zool.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332',
    name: 'PCI Evolutionary Biology',
    fetchFeed: fetchPciEvaluations('https://evolbiol.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '32025f28-0506-480e-84a0-b47ef1e92ec5',
    name: 'PCI Ecology',
    fetchFeed: fetchPciEvaluations('https://ecology.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa',
    name: 'PCI Animal Science',
    fetchFeed: fetchPciEvaluations('https://animsci.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: 'b90854bf-795c-42ba-8664-8257b9c68b0c',
    name: 'PCI Archaeology',
    fetchFeed: fetchPciEvaluations('https://archaeo.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84',
    name: 'PCI Paleontology',
    fetchFeed: fetchPciEvaluations('https://paleo.peercommunityin.org/rss/rss4elife'),
  },
];

const writeFile = (path: string) => (contents: string) => TE.taskify(fs.writeFile)(path, contents);

const byDateAscending: Ord.Ord<Evaluation> = pipe(
  D.Ord,
  Ord.contramap((ev) => ev.date),
);

const byArticleLocatorAscending: Ord.Ord<Evaluation> = pipe(
  S.Ord,
  Ord.contramap((ev) => ev.articleDoi),
);

const writeCsv = (group: Group) => (evaluations: ReadonlyArray<Evaluation>) => pipe(
  evaluations,
  RA.sortBy([byDateAscending, byArticleLocatorAscending]),
  RA.map((evaluation) => (
    `${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`
  )),
  (events) => `Date,Article DOI,Review ID\n${events.join('')}`,
  writeFile(`./data/reviews/${group.id}.csv`),
  TE.bimap(
    (error) => error.toString(),
    () => evaluations,
  ),
);

const report = (group: Group) => (message: string) => {
  const output = printf('%-30s %s\n', group.name, message);
  process.stderr.write(output);
};

const reportSuccess = (group: Group) => (evaluations: ReadonlyArray<Evaluation>) => {
  const output = printf('%5d evaluations', evaluations.length);
  report(group)(output);
};

void (async (): Promise<void> => {
  groups.forEach(async (group) => {
    await pipe(
      group.fetchFeed,
      TE.chain(writeCsv(group)),
      TE.bimap(
        report(group),
        reportSuccess(group),
      ),
    )();
  });
})();
