export type ArticleIdsByState = Record<string, ReadonlyArray<string>>;

export type GetArticleIdsByState = () => ArticleIdsByState;
