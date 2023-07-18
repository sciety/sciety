import { ViewModel } from './view-model';

export const renderAsAtom = (viewModel: ViewModel): string => `
    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${viewModel.name}</title>
      <link href="http://example.org/"/>
      <updated>${viewModel.updatedAt.toISOString()}</updated>
      <author>
        <name>John Doe</name>
      </author>
      <id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>
    </feed>
  `;
