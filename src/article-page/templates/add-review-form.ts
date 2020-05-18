import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';

interface Article {
  doi: Doi;
}

export default (article: Article, editorialCommunities: EditorialCommunityRepository): string => {
  const options = editorialCommunities.all().map((ec) => `<option value="${ec.id}">${ec.name}</option>`);
  return `<form method="post" action="/reviews" class="compact-form">
    <input type="hidden" name="articleversiondoi" value="${article.doi}">
    <label for="editorialcommunityid">Select your editorial community</label>
    <select
      name="editorialcommunityid"
      id="editorialcommunityid">
      ${options}
    </select>
    <label for="reviewdoi">DOI of the review</label>
    <div class="compact-form__row">
      <input
        type="text"
        name="reviewdoi"
        id="reviewdoi"
        placeholder="Zenodo review DOI"
        class="compact-form__article-doi"
        required>
      <button type="submit" class="compact-form__submit">
        <span class="visually-hidden">Add review</span>
      </button>
    </div>
  </form>`;
};
