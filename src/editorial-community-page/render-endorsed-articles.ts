import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

type RenderEndorsedArticle = (endorsedArticle: {doi: Doi; title: string}) => Promise<string>;

const renderEndorsedArticle: RenderEndorsedArticle = async (endorsedArticle) => `
  <div class="content">
    <a href="/articles/${endorsedArticle.doi.value}" class="header">${endorsedArticle.title}</a>
  </div>
`;

type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export default (): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const endorsedArticleData = [];

    if (editorialCommunityId === '53ed5364-a016-11ea-bb37-0242ac130002') {
      endorsedArticleData.push(
        {
          doi: new Doi('10.1101/209320'),
          title: 'Marine cyanolichens from different littoral zones are associated with distinct bacterial communities',
        },
        {
          doi: new Doi('10.1101/312330'),
          title: 'A Real Time PCR Assay for Quantification of Parasite Burden in Murine Models of Leishmaniasis',
        },
      );
    }

    if (endorsedArticleData.length === 0) {
      return '';
    }

    const endorsedArticles = await Promise.all(endorsedArticleData.map(renderEndorsedArticle));

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <ol class="ui relaxed divided items">
          ${templateListItems(endorsedArticles)}
        </ol>

      </section>
    `;
  }
);
