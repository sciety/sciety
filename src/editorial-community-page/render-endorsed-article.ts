import Doi from '../types/doi';

export interface EndorsedArticle {
  doi: Doi;
  title: string;
}

type RenderEndorsedArticle = (endorsedArticle: EndorsedArticle) => Promise<string>;

export default (endorsedArticle: EndorsedArticle): string => `
  <div class="content">
    <a href="/articles/${endorsedArticle.doi.value}" class="header">${endorsedArticle.title}</a>
  </div>
`;
