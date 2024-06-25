import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructGroupLink } from '../../../../../src/read-side/html-pages/shared-components/group-link';
import { GroupLinkWithLogoViewModel } from '../../../../../src/read-side/html-pages/shared-components/group-link/group-link-with-logo-view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';

describe('construct-group-link-with-logo', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  const linkToTheGroupsPage = `/groups/${addGroupCommand.slug}`;
  let result: GroupLinkWithLogoViewModel;
  let framework: TestFramework;

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.addGroup(addGroupCommand);
    result = pipe(
      addGroupCommand.groupId,
      constructGroupLink(framework.dependenciesForViews),
      O.getOrElseW(shouldNotBeCalled),
    );
  });

  it('provides a name', () => {
    expect(result.groupName).toStrictEqual(addGroupCommand.name);
  });

  it('provides a link to the group\'s page', () => {
    expect(result.href).toStrictEqual(linkToTheGroupsPage);
  });
});
