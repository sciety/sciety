import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';

export default (doi: Doi, editorialCommunities: EditorialCommunityRepository): string => {
  const options = editorialCommunities.all().map((ec) => `<option value="${ec.id}">${ec.name}</option>`);
  return `<form method="post" action="/reviews" class="ui form">
    <input type="hidden" name="articleversiondoi" value="${doi}">
    <div class="field">
      <label for="editorialcommunityid">Your editorial community</label>
      <select
        name="editorialcommunityid"
        id="editorialcommunityid">
        ${options}
      </select>
    </div>
    <div class="field">
      <label for="reviewdoi">Zenodo review DOI</label>
      <input
        type="text"
        name="reviewdoi"
        id="reviewdoi"
        required>
    </div>
    <button type="submit" class="ui primary button">
      Add review
    </button>
  </form>`;
};
