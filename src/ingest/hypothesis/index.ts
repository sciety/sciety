export type Annotation = {
  id: string,
  created: string,
  uri: string,
};

export type Response = {
  rows: Array<Annotation>,
};
