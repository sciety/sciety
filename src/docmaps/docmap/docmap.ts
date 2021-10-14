import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { context } from './context';
import { DocmapIdentifier, generateDocmapViewModel, Ports } from './generate-docmap-view-model';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type Output = {
  type: 'review-article',
  published: Date,
  content: ReadonlyArray<unknown>,
};

type Action = {
  participants: ReadonlyArray<unknown>,
  outputs: ReadonlyArray<Output>,
};

type Step = {
  assertions: [],
  inputs: ReadonlyArray<unknown>,
  actions: ReadonlyArray<Action>,
};

type Publisher = {
  id: string,
  name: string,
  logo: string,
  homepage: string,
  account: {
    id: string,
    service: 'https://sciety.org',
  },
};

export type Docmap = {
  '@context': Record<string, unknown>,
  id: string,
  type: 'docmap',
  created: string,
  updated: string,
  publisher: Publisher,
  'first-step': '_:b0',
  steps: Record<string, Step>,
};

const createReviewArticleOutput = (
  articleId: Doi,
) => (
  evaluation: {
    occurredAt: Date,
    reviewId: string,
    sourceUrl: URL,
  },
) => ({
  type: 'review-article' as const,
  published: evaluation.occurredAt,
  content: [
    {
      type: 'web-page',
      url: evaluation.sourceUrl.toString(),
    },
    {
      type: 'web-page',
      url: `https://sciety.org/articles/activity/${articleId.value}#${evaluation.reviewId}`,
    },
  ],
});

type CreateDocmap = (
  ports: Ports,
) => (
  docmapIdentifier: DocmapIdentifier
) => TE.TaskEither<DE.DataError, Docmap>;

export const docmap: CreateDocmap = (ports) => ({ articleId, groupId }) => pipe(
  { articleId, groupId },
  generateDocmapViewModel(ports),
  TE.map(({
    group, inputPublishedDate, evaluations,
  }) => ({
    '@context': context,
    id: `https://sciety.org/docmaps/v1/articles/${articleId.value}.docmap.json`,
    type: 'docmap',
    created: RNEA.head(evaluations).occurredAt.toISOString(),
    updated: RNEA.last(evaluations).occurredAt.toISOString(),
    publisher: {
      id: group.homepage,
      name: group.name,
      logo: `https://sciety.org${group.avatarPath}`,
      homepage: group.homepage,
      account: {
        id: `https://sciety.org/groups/${group.id}`,
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
              published: date,
            }],
          ),
        ),
        actions: [
          {
            participants: [
              { actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' },
            ],
            outputs: pipe(
              evaluations,
              RA.map(createReviewArticleOutput(articleId)),
            ),
          },
        ],
      },
    },
  })),
);
