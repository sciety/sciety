import EditorialCommunityId from '../types/editorial-community-id';

type RenderFollowToggle = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (): RenderFollowToggle => (
  async (editorialCommunityId) => (`
    <form method="post" action="/unfollow">
      <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
      <button type="submit">Unfollow</button>
    </form>
  `)
);
