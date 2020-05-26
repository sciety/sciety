import Doi from '../../src/data/doi';
import {
  createDiscoverMostRecentReviews,
  EditorialCommunity,
  FetchedArticle,
  ReviewReference,
} from '../../src/home-page/render-home-page';

describe('construct-view-model middleware', (): void => {
  it('adds most recent reviews to the context', async (): Promise<void> => {
    const reviewReferences = (): Array<ReviewReference> => [
      {
        articleVersionDoi: new Doi('10.1101/642017'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        added: new Date('2020-05-20T00:00:00Z'),
      },
      {
        articleVersionDoi: new Doi('10.1101/615682'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        added: new Date('2020-05-19T00:00:00Z'),
      },
      {
        articleVersionDoi: new Doi('10.1101/815689'),
        editorialCommunityId: 'e3a371f9-576d-48d5-a690-731b9fea26bd',
        added: new Date('2020-05-21T00:00:00Z'),
      },
    ];
    const fetchArticle = async (doi: Doi): Promise<FetchedArticle> => Promise.resolve({
      doi,
      title: `Article ${doi}`,
    });
    const editorialCommunities = async (): Promise<Array<EditorialCommunity>> => [
      {
        id: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        name: 'eLife',
      },
      {
        id: 'e3a371f9-576d-48d5-a690-731b9fea26bd',
        name: 'Royal Society of Psychoceramics',
      },
    ];
    const viewModel = await createDiscoverMostRecentReviews(reviewReferences, fetchArticle, editorialCommunities, 2)();

    expect(viewModel).toHaveLength(2);
    expect(viewModel[0]).toMatchObject({
      articleDoi: new Doi('10.1101/815689'),
      articleTitle: 'Article 10.1101/815689',
      editorialCommunityName: 'Royal Society of Psychoceramics',
      added: new Date('2020-05-21T00:00:00Z'),
    });
    expect(viewModel[1]).toMatchObject({
      articleDoi: new Doi('10.1101/642017'),
      articleTitle: 'Article 10.1101/642017',
      editorialCommunityName: 'eLife',
      added: new Date('2020-05-20T00:00:00Z'),
    });
  });
});
