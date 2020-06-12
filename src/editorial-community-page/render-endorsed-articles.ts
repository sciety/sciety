type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export default (): RenderEndorsedArticles => (
  async (editorialCommunityId) => (
    `<!-- Editorial community id: ${editorialCommunityId} -->`
  )
);
