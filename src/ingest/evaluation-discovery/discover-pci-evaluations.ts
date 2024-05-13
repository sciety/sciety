import { DOMParser } from '@xmldom/xmldom';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { ingestionWindowStartDate } from './ingestion-window-start-date';
import * as AID from '../../types/article-id';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { constructPublishedEvaluation } from '../types/published-evaluation';

type Candidate = {
  date: string,
  articleId: string,
  reviewId: string,
};

const identifyCandidates = (since: Date) => (feed: string) => {
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
      AID.articleIdCodec.decode,
      E.bimap(
        () => ({
          item: candidate.reviewId,
          reason: 'malformed evaluation doi',
        }),
        (validatedEvaluationDoi) => constructPublishedEvaluation({
          publishedOn: new Date(candidate.date),
          paperExpressionDoi: articleDoi,
          evaluationLocator: AID.toString(validatedEvaluationDoi),
        }),
      ),
    );
  }

  return E.left({
    item: candidate.articleId,
    reason: 'not a biorxiv|medrxiv DOI',
  });
};

export const discoverPciEvaluations = (
  url: string,
): DiscoverPublishedEvaluations => (
  ingestDays,
) => (
  dependencies,
) => pipe(
  dependencies.fetchData<string>(url),
  TE.map(identifyCandidates(ingestionWindowStartDate(ingestDays))),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((items) => ({
    understood: RA.rights(items),
    skipped: RA.lefts(items),
  })),
);
