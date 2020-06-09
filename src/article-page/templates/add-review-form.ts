import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';

export default (doi: Doi, editorialCommunities: EditorialCommunityRepository): string => {
  const options = editorialCommunities.all().map((ec) => `<option value="${ec.id}">${ec.name}</option>`);
  return `<form method="post" action="/reviews" class="ui form">
    <input type="hidden" name="articleversiondoi" value="${doi}">
    <p>
      Please select the Editorial Community you represent and enter a Zenodo DOI.
    </p>
    <div class="field">
      <select
        name="editorialcommunityid"
        id="editorialcommunityid">
        ${options}
      </select>
    </div>
    <div class="field">
      <input
        type="text"
        name="reviewdoi"
        id="reviewdoi"
        placeholder="Zenodo review DOI"
        required>
    </div>
    <button type="submit" class="ui primary button">
      Add review
    </button>
  </form>`;
};
