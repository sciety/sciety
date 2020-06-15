import createRenderEndorsedArticles, {
  createGetHardCodedEndorsedArticles,
  GetArticleTitle,
} from './render-endorsed-articles';
import templateHeader from './templates/header';
import templateReviewedArticles from './templates/reviewed-articles';
import Doi from '../data/doi';

interface EditorialCommunity {
  name: string;
  description: string;
  logo?: string;
}

interface ReviewedArticles {
  reviewedArticles: Array<{
    doi: Doi;
    title: string;
  }>;
}

type RenderPageHeader = (editorialCommunity: EditorialCommunity) => Promise<string>;

const createRenderPageHeader = (): RenderPageHeader => (
  async (editorialCommunity) => Promise.resolve(templateHeader(editorialCommunity))
);

const articleTitles: Record<string, string> = {
  '10.1101/209320': 'Marine cyanolichens from different littoral zones are associated with distinct bacterial communities',
  '10.1101/312330': 'A Real Time PCR Assay for Quantification of Parasite Burden in Murine Models of Leishmaniasis',
};

export default async (
  editorialCommunityId: string,
  viewModel: EditorialCommunity & ReviewedArticles,
): Promise<string> => {
  const renderPageHeader = createRenderPageHeader();
  const getArticleTitle: GetArticleTitle = async (articleDoi) => (
    articleTitles[articleDoi.value] ?? 'Unknown article title'
  );
  const renderEndorsedArticles = createRenderEndorsedArticles(createGetHardCodedEndorsedArticles(getArticleTitle));

  return `
    ${await renderPageHeader(viewModel)}
    ${await renderEndorsedArticles(editorialCommunityId)}
    ${templateReviewedArticles(viewModel.reviewedArticles)}
  `;
};
