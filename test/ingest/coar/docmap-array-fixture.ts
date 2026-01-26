import { arbitraryDate, arbitraryString } from '../../helpers';

export const exampleDocmapResponseReviewAction = (
  outputDoi: string,
  outputPublishedDate: Date,
  inputDoi: string,
): JSON => ({
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
} as unknown as JSON);

export const constructMinimalDocmapResponseExampleStepWithReviewActions = (
  docmapReviewActions: ReadonlyArray<unknown>,
): JSON => ({
  actions: docmapReviewActions,
} as unknown as JSON);

export const constructMinimalDocmapResponseExampleStepWithoutReviewActions = (): JSON => ({
  actions: [{ type: 'other' }],
} as unknown as JSON);

export const constructMinimalDocmapResponseExampleWithSteps = (steps: Record<string, unknown>): JSON => ({
  steps,
} as unknown as JSON);
