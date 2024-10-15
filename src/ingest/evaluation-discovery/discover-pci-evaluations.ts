import { XMLParser } from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { ingestionWindowStartDate } from './ingestion-window-start-date';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { constructPublishedEvaluation } from '../types/published-evaluation';

type Candidate = {
  date: string,
  articleId: string,
  reviewId: string,
};

const parser = new XMLParser({
  isArray: (name) => name === 'link',
});

const parseXmlDocument = (s: string) => E.tryCatch(
  () => parser.parse(s) as unknown,
  () => 'Failed to parse XML',
);

const filterByDate = (since: Date) => (candidates: ReadonlyArray<Candidate>) => pipe(
  candidates,
  RA.filter((candidate) => (new Date(candidate.date).getTime()) > since.getTime()),
);

/**
 * @deprecated extend and use supportedArticleIdFromLink instead.
 */
const linkContainingDoiRegex = /^\s*(?:doi:|(?:(?:https?:\/\/)?(?:(?:dx|www)\.)?doi\.org\/))?(10\.[0-9]+\/(?:[^%"#?\s])+)\s*$/;

const toEvaluationOrSkip = (candidate: Candidate) => {
  const [, articleDoi] = linkContainingDoiRegex.exec(candidate.articleId) ?? [];
  if (articleDoi) {
    return pipe(
      candidate.reviewId,
      S.replace('https://doi.org/', ''),
      S.replace('http://dx.doi.org/', ''),
      (reviewId) => constructPublishedEvaluation({
        publishedOn: new Date(candidate.date),
        paperExpressionDoi: articleDoi,
        evaluationLocator: `doi:${reviewId}`,
      }),
      E.right,
    );
  }

  return E.left({
    item: candidate.articleId,
    reason: 'not parseable into a DOI',
  });
};

const arrayOfLinkElements = t.strict({
  link: t.readonlyArray(t.strict({
    doi: t.string,
    resource: t.strict({
      doi: t.string,
      date: t.string,
    }),
  })),
});

const emptyLinksElement = t.literal('');

const pciEvaluationsCodec = t.strict({
  links: t.union([arrayOfLinkElements, emptyLinksElement]),
});

export const discoverPciEvaluations = (
  url: string,
): DiscoverPublishedEvaluations => (
  ingestDays,
) => (
  dependencies,
) => pipe(
  dependencies.fetchData<string>(url),
  TE.chainEitherK(parseXmlDocument),
  TE.chainEitherKW(flow(
    pciEvaluationsCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => errors.join('\n')),
  )),
  TE.map((decodedResponse) => (decodedResponse.links === '' ? [] : decodedResponse.links.link)),
  TE.map(RA.map((item) => ({
    date: item.resource.date,
    reviewId: item.resource.doi,
    articleId: item.doi,
  }))),
  TE.map(filterByDate(ingestionWindowStartDate(ingestDays))),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((items) => ({
    understood: RA.rights(items),
    skipped: RA.lefts(items),
  })),
);
