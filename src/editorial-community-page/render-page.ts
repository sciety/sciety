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

const renderEndorsedArticles = async (editorialCommunityId: string): Promise<string> => (
  `<!-- Editorial community id: ${editorialCommunityId} -->`
);

export default async (
  editorialCommunityId: string,
  viewModel: EditorialCommunity & ReviewedArticles,
): Promise<string> => {
  const renderPageHeader = createRenderPageHeader();

  return `
    ${await renderPageHeader(viewModel)}
    ${await renderEndorsedArticles(editorialCommunityId)}
    ${templateReviewedArticles(viewModel.reviewedArticles)}
  `;
};
