import { ViewModel } from './view-model';

export const renderAsAtom = (viewModel: ViewModel): string => `
  <?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>${viewModel.name}</title>
    <link rel="alternate" href="${viewModel.listPageAbsoluteUrl.toString()}"/>
    <link rel="self" href="${viewModel.listPageAbsoluteUrl.toString()}/feed.atom"/>
    <updated>${viewModel.updatedAt.toISOString()}</updated>
    <author>
      <name>${viewModel.ownerName}</name>
    </author>
    <id>urn:uuid:${viewModel.listId}</id>
  </feed>
`;
