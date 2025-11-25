import { arbitraryDate, arbitraryString } from '../../../helpers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const arbitraryDocmapReviewAction = (outputDoi: string, outputPublishedDate: Date, inputDoi: string) => ({
  participants: [{
    actor: {
      type: 'person',
      name: arbitraryString(),
    },
    role: 'author',
  }],
  outputs: [{
    doi: outputDoi,
    published: outputPublishedDate.toISOString(),
    type: 'editorial-decision',
  }],
  inputs: [{
    doi: inputDoi,
    published: arbitraryDate().toISOString(),
    type: 'preprint',
  }],
});

export const constructMinimalDocmapStepWithReviewActions = (
  docmapReviewActions: ReadonlyArray<unknown>,
): unknown => ({
  actions: docmapReviewActions,
});

export const constructMinimalDocmapStepWithoutReviewActions = (): unknown => ({
  actions: [{ type: 'other' }],
});

export const constructMinimalDocmapWithSteps = (steps: Record<string, unknown>): unknown => ({
  steps,
});
