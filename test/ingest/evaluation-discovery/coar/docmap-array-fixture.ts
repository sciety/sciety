import { arbitraryDate, arbitraryString } from '../../../helpers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const arbitraryDocmapReviewAction = () => ({
  participants: [{
    actor: {
      type: 'person',
      name: arbitraryString(),
    },
    role: 'author',
  }],
  outputs: [{
    doi: arbitraryString(),
    published: arbitraryDate().toISOString(),
    type: 'editorial-decision',
  }],
  inputs: [{
    doi: arbitraryString(),
    published: arbitraryDate().toISOString(),
    type: 'preprint',
  }],
});

type DocmapReviewAction = ReturnType<typeof arbitraryDocmapReviewAction>;

export const constructMinimalDocmapStepWithReviewActions = (
  docmapReviewActions: ReadonlyArray<DocmapReviewAction>,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => ({
  actions: docmapReviewActions,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const constructMinimalDocmapStepWithoutReviewActions = () => ({
  actions: [{ type: 'other' }],
});

type StepWithReviewActions = ReturnType<typeof constructMinimalDocmapStepWithReviewActions>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const constructMinimalDocmapWithSteps = (steps: Record<string, StepWithReviewActions | unknown>) => ({
  steps,
});
