import fs from 'fs';
import axios from 'axios';
import { printf } from 'fast-printf';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { DOMParser } from 'xmldom';

type Group = {
  id: string,
  name: string,
  url: string,
};

const groups: Array<Group> = [
  {
    id: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de',
    name: 'PCI Zoology',
    url: 'https://zool.peercommunityin.org/rss/rss4elife',
  },
  {
    id: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332',
    name: 'PCI Evolutionary Biology',
    url: 'https://evolbiol.peercommunityin.org/rss/rss4elife',
  },
  {
    id: '32025f28-0506-480e-84a0-b47ef1e92ec5',
    name: 'PCI Ecology',
    url: 'https://ecology.peercommunityin.org/rss/rss4elife',
  },
  {
    id: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa',
    name: 'PCI Animal Science',
    url: 'https://animsci.peercommunityin.org/rss/rss4elife',
  },
  {
    id: 'b90854bf-795c-42ba-8664-8257b9c68b0c',
    name: 'PCI Archaeology',
    url: 'https://archaeo.peercommunityin.org/rss/rss4elife',
  },
  {
    id: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84',
    name: 'PCI Paleontology',
    url: 'https://paleo.peercommunityin.org/rss/rss4elife',
  },
];

const parser = new DOMParser({
  errorHandler: (_, msg) => {
    throw msg;
  },
});

type Evaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

const fetchPage = async (url: string): Promise<string> => {
  try {
    const response = await axios.get<string>(url);
    return response.data;
  } catch (e: unknown) {
    process.stderr.write(`Could not fetch ${url}\n`);
    throw e;
  }
};

const fetchPciEvaluations = async (url: string): Promise<Array<Evaluation>> => {
  const result = [];

  const feed = await fetchPage(url);
  const doc = parser.parseFromString(feed, 'text/xml');

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
};

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
  TE.map(() => evaluations),
);

const report = (group: Group) => (message: string) => {
  const output = printf('%-30s %s\n', group.name, message);
  process.stderr.write(output);
};

const reportSuccess = (group: Group) => (evaluations: ReadonlyArray<Evaluation>) => {
  const output = printf('%5d evaluations', evaluations.length);
  report(group)(output);
};

const reportError = (group: Group) => (error: NodeJS.ErrnoException) => {
  report(group)(error.toString());
};

void (async (): Promise<void> => {
  groups.forEach(async (group) => {
    await pipe(
      await fetchPciEvaluations(group.url),
      writeCsv(group),
      TE.bimap(
        reportError(group),
        reportSuccess(group),
      ),
    )();
  });
})();
