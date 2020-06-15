import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

type RenderEndorsedArticle = (endorsedArticle: {doi: Doi; title: string}) => Promise<string>;

const renderEndorsedArticle: RenderEndorsedArticle = async (endorsedArticle) => `
  <div class="content">
    <a href="/articles/${endorsedArticle.doi.value}" class="header">${endorsedArticle.title}</a>
  </div>
`;

type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<{doi: Doi; title: string}>>;

export const getHardCodedEndorsedArticles: GetEndorsedArticles = async (editorialCommunityId) => {
  if (editorialCommunityId !== '53ed5364-a016-11ea-bb37-0242ac130002') {
    return [];
  }

  return [
    {
      doi: new Doi('10.1101/209320'),
      title: 'Marine cyanolichens from different littoral zones are associated with distinct bacterial communities',
    },
    {
      doi: new Doi('10.1101/312330'),
      title: 'A Real Time PCR Assay for Quantification of Parasite Burden in Murine Models of Leishmaniasis',
    },
  ];
};

export default (getEndorsedArticles: GetEndorsedArticles): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const endorsedArticles = await getEndorsedArticles(editorialCommunityId);

    if (endorsedArticles.length === 0) {
      return '';
    }

    const renderedEndorsedArticles = await Promise.all(endorsedArticles.map(renderEndorsedArticle));

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <ol class="ui relaxed divided items">
          ${templateListItems(renderedEndorsedArticles)}
        </ol>

      </section>
    `;
  }
);
