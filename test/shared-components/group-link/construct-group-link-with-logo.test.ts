import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { GroupLinkWithLogoViewModel } from '../../../src/shared-components/group-link/group-link-with-logo-view-model';
import {
  arbitraryRecordEvaluationPublicationCommand,
} from '../../write-side/commands/record-evaluation-publication-command.helper';

import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { constructGroupLink } from '../../../src/shared-components/group-link';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { toExpressionDoi } from '../../../src/types/article-id';

describe('construct-group-link-with-logo', () => {
  const articleId = arbitraryArticleId();
  const addGroupCommand = arbitraryAddGroupCommand();
  const linkToTheGroupsPage = `/groups/${addGroupCommand.slug}`;
  let result: GroupLinkWithLogoViewModel;
  let framework: TestFramework;

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.recordEvaluationPublication({
      ...arbitraryRecordEvaluationPublicationCommand(),
      expressionDoi: toExpressionDoi(articleId),
      groupId: addGroupCommand.groupId,
      evaluationType: undefined,
    });
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
