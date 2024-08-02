import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { crossrefWorksApiUrlFilteredForMicrobiologySociety } from './crossref-works-api-filtered-for-microbiology-society-url';
import { determinePagesToSelect, SelectedPage } from './determine-pages-to-select';
import { Dependencies, DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { PublishedEvaluation, constructPublishedEvaluation } from '../types/published-evaluation';

const publishedDateCodec = t.strict({
  'date-parts': t.tuple([
    t.tuple([t.number, t.number, t.number]),
  ]),
});

type PublishedDate = t.TypeOf<typeof publishedDateCodec>;

const toEvaluationDate = (date: PublishedDate): Date => {
  const dateParts = date['date-parts'][0];
  return new Date(
    dateParts[0],
    dateParts[1] - 1,
    dateParts[2],
  );
};

const crossrefResponseCodec = t.strict({
  message: t.strict({
    items: t.readonlyArray(t.strict({
      DOI: t.string,
      published: publishedDateCodec,
      relation: t.strict({
        'is-review-of': t.tuple([t.strict({
          id: t.string,
        })]),
      }),
    })),
  }),
});

type CrossrefResponse = t.TypeOf<typeof crossrefResponseCodec>;

const toEvaluation = (
  item: CrossrefResponse['message']['items'][number],
): PublishedEvaluation => constructPublishedEvaluation({
  evaluationLocator: `doi:${item.DOI}`,
  paperExpressionDoi: item.relation['is-review-of'][0].id,
  evaluationType: 'review',
  publishedOn: toEvaluationDate(item.published),
});

const toHumanFriendlyErrorMessage = (
  errors: t.Errors,
) => pipe(
  errors,
  formatValidationErrors,
  (formattedErrors) => `acmi: could not decode crossref response ${formattedErrors.join(', ')}`,
);

const getEvaluationsFromCrossref = (dependencies: Dependencies) => (url: string) => pipe(
  url,
  dependencies.fetchData,
  TE.chainEitherK(flow(
    crossrefResponseCodec.decode,
    E.mapLeft(toHumanFriendlyErrorMessage),
  )),
  TE.map((response) => response.message.items),
  TE.map(RA.map(toEvaluation)),
);

const buildQueryUrl = (selectedPage: SelectedPage) => {
  const queryUrl = new URL(crossrefWorksApiUrlFilteredForMicrobiologySociety);
  queryUrl.searchParams.set('sort', 'published');
  queryUrl.searchParams.set('order', 'asc');
  queryUrl.searchParams.set('rows', selectedPage.rows.toString());
  queryUrl.searchParams.set('offset', selectedPage.offset.toString());
  return queryUrl.toString();
};

export const discoverEvaluationsForAccessMicrobiologyViaCrossref: DiscoverPublishedEvaluations = () => (
  dependencies,
) => pipe(
  dependencies,
  determinePagesToSelect(1000),
  TE.map(RA.map(buildQueryUrl)),
  TE.chain(RA.traverse(TE.ApplicativePar)(getEvaluationsFromCrossref(dependencies))),
  TE.map(RA.flatten),
  TE.map((evaluations) => ({
    understood: evaluations,
    skipped: [],
  })),
);
