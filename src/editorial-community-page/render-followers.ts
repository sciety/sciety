import EditorialCommunityId from '../types/editorial-community-id';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (): RenderFollowers => (
  async () => `
    <section class="ui very padded vertical segment">
      <h2 class="ui header">
        Followers
      </h2>
      <p>No followers yet.</p>
    </section>
  `
);
