export type Evaluation = {
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

export type Evaluations = ReadonlyArray<Evaluation>;

export const constructEvaluation = (properties: Properties): Evaluation => ({
  authors: [],
  ...properties,
});
