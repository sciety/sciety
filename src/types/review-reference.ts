import Doi from '../data/doi';

export default interface ReviewReference {
  articleVersionDoi: Doi;
  reviewDoi: Doi;
  // reviewDoi: Doi|HypothesisUrl;
  // reviewDoi: { type: string, url: string }
  // reviewDoi: { type: 'doi', url: 'https://doi.org/10.1111/1234' }
  // reviewDoi: { type: 'hypothesis', url: '...' }
  editorialCommunityId: string;
  added: Date;
}
