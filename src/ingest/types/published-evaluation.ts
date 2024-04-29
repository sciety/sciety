export type PublishedEvaluation = {
  publishedOn: Date,
  paperExpressionDoi: string,
  evaluationLocator: string,
  authors: ReadonlyArray<string>,
  evaluationType?: string,
};

type Properties = {
  publishedOn: Date,
  paperExpressionDoi: string,
  evaluationLocator: string,
  authors?: ReadonlyArray<string>,
  evaluationType?: string,
};

export const constructPublishedEvaluation = (properties: Properties): PublishedEvaluation => ({
  authors: [],
  ...properties,
});
