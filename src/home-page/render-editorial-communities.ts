import templateListItems from '../templates/list-items';

type RenderEditorialCommunities = () => Promise<string>;

interface EditorialCommunity {
  id: string;
  name: string;
}

export default (editorialCommunities: () => Promise<Array<EditorialCommunity>>): RenderEditorialCommunities => (
  async () => {
    const editorialCommunityLinks = (await editorialCommunities())
      .map((editorialCommunity) => (
        `<a href="/editorial-communities/${editorialCommunity.id}">${editorialCommunity.name}</a>`
      ));

    return `
      <section>
        <h2 class="ui header">
          Editorial communities
        </h2>
        <ol class="u-normalised-list">
          ${templateListItems(editorialCommunityLinks)}
        </ol>
      </section>
    `;
  }
);
