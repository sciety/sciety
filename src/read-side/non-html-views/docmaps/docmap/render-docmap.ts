import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { Action } from './action';
import { Docmap } from './docmap-type';
import { anonymous, peerReviewer } from './peer-reviewer';
import { publisherAccountId } from './publisher-account-id';
import { DocmapViewModel } from './view-model';
import * as EL from '../../../../types/evaluation-locator';
import * as EDOI from '../../../../types/expression-doi';
import { constructPaperActivityPageHref } from '../../../paths';

const renderInputs = (expressionDoi: EDOI.ExpressionDoi) => [{
  doi: expressionDoi,
  url: `https://doi.org/${expressionDoi}`,
}];

const createAction = (expressionDoi: EDOI.ExpressionDoi) => (action: Action) => ({
  participants: pipe(
    action.authors,
    RA.match(
      () => [peerReviewer(anonymous)],
      RA.map(peerReviewer),
    ),
  ),
  inputs: renderInputs(expressionDoi),
  outputs: [
    {
      type: 'review-article' as const,
      published: action.publishedAt.toISOString(),
      content: [
        {
          type: 'web-page' as const,
          url: action.webPageOriginalUrl.toString(),
        },
        {
          type: 'web-page' as const,
          url: `https://sciety.org${constructPaperActivityPageHref(expressionDoi)}#${EL.serialize(action.evaluationLocator)}`,
        },
        {
          type: 'web-content' as const,
          url: action.webContentUrl.toString(),
        },
      ],
    },
  ],
});

export const renderDocmap = (viewModel: DocmapViewModel): Docmap => ({
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: `https://sciety.org/docmaps/v1/articles/${viewModel.expressionDoi}/${viewModel.group.slug}.docmap.json`,
  type: 'docmap',
  created: RNEA.head(viewModel.actions).recordedAt.toISOString(),
  updated: viewModel.updatedAt.toISOString(),
  publisher: {
    id: viewModel.group.homepage,
    name: viewModel.group.name,
    logo: viewModel.group.avatarPath,
    homepage: viewModel.group.homepage,
    account: {
      id: publisherAccountId(viewModel.group),
      service: 'https://sciety.org',
    },
  },
  'first-step': '_:b0',
  steps: {
    '_:b0': {
      assertions: [],
      inputs: renderInputs(viewModel.expressionDoi),
      actions: pipe(
        viewModel.actions,
        RA.map(createAction(viewModel.expressionDoi)),
      ),
    },
  },
});
