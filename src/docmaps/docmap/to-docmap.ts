import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { anonymousReviewer } from './anonymous-reviewer';
import { Docmap } from './docmap-type';
import { Evaluation } from './evaluation';
import { DocmapModel } from './generate-docmap-view-model';
import { publisherAccountId } from './publisher-account-id';
import { Doi } from '../../types/doi';
import * as RI from '../../types/review-id';

const createAction = (
  articleId: Doi,
) => (
  evaluation: Evaluation,
) => ({
  participants: [
    anonymousReviewer,
  ],
  outputs: [
    {
      type: 'review-article' as const,
      published: evaluation.occurredAt.toISOString(),
      content: [
        {
          type: 'web-page',
          url: evaluation.sourceUrl.toString(),
        },
        {
          type: 'web-page',
          url: `https://sciety.org/articles/activity/${articleId.value}#${RI.serialize(evaluation.reviewId)}`,
        },
      ],
    },
  ],
});

export const toDocmap = ({
  group, inputPublishedDate, evaluations, articleId,
}: DocmapModel): Docmap => ({
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: `https://sciety.org/docmaps/v1/articles/${articleId.value}/${group.slug}.docmap.json`,
  type: 'docmap',
  created: RNEA.head(evaluations).occurredAt.toISOString(),
  updated: RNEA.last(evaluations).occurredAt.toISOString(),
  publisher: {
    id: group.homepage,
    name: group.name,
    logo: `https://sciety.org${group.avatarPath}`,
    homepage: group.homepage,
    account: {
      id: publisherAccountId(group),
      service: 'https://sciety.org',
    },
  },
  'first-step': '_:b0',
  steps: {
    '_:b0': {
      assertions: [],
      inputs: pipe(
        inputPublishedDate,
        O.fold(
          () => [{
            doi: articleId.value,
            url: `https://doi.org/${articleId.value}`,
          }],
          (date) => [{
            doi: articleId.value,
            url: `https://doi.org/${articleId.value}`,
            published: date.toISOString(),
          }],
        ),
      ),
      actions: pipe(
        evaluations,
        RA.map(createAction(articleId)),
      ),
    },
  },
});
