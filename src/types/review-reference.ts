import Doi from '../data/doi';

export default interface ReviewReference {
  articleVersionDoi: Doi;
  reviewDoi: Doi;
  editorialCommunityId: string;
}
