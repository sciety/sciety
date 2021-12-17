import { DOMParser } from '@xmldom/xmldom';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { FetchData } from './fetch-data';
import { daysAgo } from './time';
import { FetchEvaluations } from './update-all';
import { DoiFromString } from '../types/codecs/DoiFromString';

type Candidate = {
  date: string,
  articleId: string,
  reviewId: string,
};

const since = daysAgo(60);

const identifyCandidates = (feed: string) => {
  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });
  const doc = parser.parseFromString(feed, 'text/xml');
  const candidates = [];
  // eslint-disable-next-line no-loops/no-loops
  for (const link of Array.from(doc.getElementsByTagName('link'))) {
    const articleDoiString = link.getElementsByTagName('doi')[1]?.textContent ?? '';
    const reviewDoiString = link.getElementsByTagName('doi')[0]?.textContent ?? '';
    const date = link.getElementsByTagName('date')[0]?.textContent ?? '';
    if ((new Date(date).getTime()) > since.getTime()) {
      candidates.push({
        date,
        articleId: articleDoiString,
        reviewId: reviewDoiString,
      });
    }
  }
  return candidates;
};

const toEvaluationOrSkip = (candidate: Candidate) => {
  const bioAndmedrxivDoiRegex = /^\s*(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.1101\/(?:[^%"#?\s])+)\s*$/;
  const [, articleDoi] = bioAndmedrxivDoiRegex.exec(candidate.articleId) ?? [];
  if (articleDoi) {
    return pipe(
      candidate.reviewId,
      S.replace('https://doi.org/', ''),
      S.replace('http://dx.doi.org/', ''),
      DoiFromString.decode,
      E.bimap(
        () => ({
          item: candidate.reviewId,
          reason: 'malformed evaluation doi',
        }),
        (validatedEvaluationDoi) => ({
          date: new Date(candidate.date),
          articleDoi,
          evaluationLocator: validatedEvaluationDoi.toString(),
          authors: [],
        }),
      ),
    );
  }

  return E.left({
    item: candidate.articleId,
    reason: 'not a biorxiv|medrxiv DOI',
  });
};

type Ports = {
  fetchData: FetchData,
};

export const fetchPciEvaluations = (url: string): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<string>(url),
  TE.map(identifyCandidates),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((items) => ({
    evaluations: RA.rights(items),
    skippedItems: RA.lefts(items),
  })),
);
