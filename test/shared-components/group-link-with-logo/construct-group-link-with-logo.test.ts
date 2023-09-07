import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { ViewModel } from '../../../src/shared-components/group-link-with-logo/view-model';
import {
  arbitraryRecordEvaluationPublicationCommand,
} from '../../write-side/commands/record-evaluation-publication-command.helper';

import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { constructGroupLinkWithLogo } from '../../../src/shared-components/group-link-with-logo';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('construct-group-link-with-logo', () => {
  const article = arbitraryArticleId();
  const addGroupCommand = arbitraryAddGroupCommand();
  const linkToTheGroupsPage = `/groups/${addGroupCommand.slug}`;
  let result: ViewModel;
  let framework: TestFramework;

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.recordEvaluationPublication({
      ...arbitraryRecordEvaluationPublicationCommand(),
      articleId: article,
      groupId: addGroupCommand.groupId,
      evaluationType: undefined,
    });
    result = pipe(
      addGroupCommand.groupId,
      constructGroupLinkWithLogo(framework.dependenciesForViews),
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
