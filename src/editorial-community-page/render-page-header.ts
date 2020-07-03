import templateHeader from './templates/header';

interface EditorialCommunity {
  name: string;
  description: string;
  logo?: string;
}

export type RenderPageHeader = (editorialCommunityId: string) => Promise<string>;

export type GetEditorialCommunity = (editorialCommunityId: string) => Promise<EditorialCommunity>;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => (
  async (editorialCommunityId) => Promise.resolve(templateHeader(await getEditorialCommunity(editorialCommunityId)))
);
