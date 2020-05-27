import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';

interface Article {
  doi: Doi;
}

export default (article: Article, editorialCommunities: EditorialCommunityRepository): string => {
  const options = editorialCommunities.all().map((ec) => `<option value="${ec.id}">${ec.name}</option>`);
  return `<form method="post" action="/reviews" class="add-review-form">
    <input type="hidden" name="articleversiondoi" value="${article.doi}">
    <p class="help-text">
      Please select the Editorial Community you represent and enter a Zenodo DOI.
    </p>
    <select
      name="editorialcommunityid"
      id="editorialcommunityid">
      ${options}
    </select>
    <input
      type="text"
      name="reviewdoi"
      id="reviewdoi"
      placeholder="Zenodo review DOI"
      class="add-review-form__review-doi"
      required>
    <button type="submit" class="mdc-button mdc-button--raised">
      <span class="mdc-button__label">
        Add review
      </span>
    </button>
    <p class="warning">
      This platform is for demonstration purposes only and data entered may not persist.
    </p>
  </form>`;
};
