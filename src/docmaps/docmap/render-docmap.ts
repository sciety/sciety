import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { Docmap } from './docmap-type';
import { Evaluation } from './evaluation';
import { DocmapViewModel } from './construct-docmap-view-model';
import { anonymous, peerReviewer } from './peer-reviewer';
import { publisherAccountId } from './publisher-account-id';
import { ArticleId } from '../../types/article-id';
import * as EL from '../../types/evaluation-locator';

const createAction = (articleId: ArticleId) => (evaluation: Evaluation) => ({
  participants: pipe(
    evaluation.authors,
    RA.match(
      () => [peerReviewer(anonymous)],
      RA.map(peerReviewer),
    ),
  ),
  outputs: [
    {
      type: 'review-article' as const,
      published: evaluation.publishedAt.toISOString(),
      content: [
        {
          type: 'web-page',
          url: evaluation.sourceUrl.toString(),
        },
        {
          type: 'web-page',
          url: `https://sciety.org/articles/activity/${articleId.value}#${EL.serialize(evaluation.evaluationLocator)}`,
        },
        {
          type: 'web-content',
          url: `https://sciety.org/evaluations/${EL.serialize(evaluation.evaluationLocator)}/content`,
        },
      ],
    },
  ],
});

const constructDocmapUpdatedField = (evaluations: DocmapViewModel['evaluations']) => RNEA.last(evaluations).recordedAt.toISOString();

export const renderDocmap = ({
  group, inputPublishedDate, evaluations, articleId,
}: DocmapViewModel): Docmap => ({
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: `https://sciety.org/docmaps/v1/articles/${articleId.value}/${group.slug}.docmap.json`,
  type: 'docmap',
  created: RNEA.head(evaluations).recordedAt.toISOString(),
  updated: constructDocmapUpdatedField(evaluations),
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
