import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/Task";
import * as RA from "fp-ts/ReadonlyArray";
import { callApi } from "./../feature-test/helpers/call-api.helper";
import { group } from "console";

// coupled to hardcoded data in src
const groupsToHighlight = [
  "4bbf0c12-629b-4bb8-91d6-974f4df8efb2",
  "b560187e-f2fb-4ff9-a861-a204f3fc0fb0",
  "f97bd177-5cb6-4296-8573-078318755bf2",
  "316db7d9-88cc-4c26-b386-f067e0f56334",
  "50401e46-b764-47b7-8557-6bb35444b7c8",
  "5142a5bc-6b18-42b1-9a8d-7342d7d17e94",
  "bc1f956b-12e8-4f5c-aadc-70f91347bd18",
  "f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58",
];

const stubHighlightedGroup = (groupId: string) => async () => {
  const homePageGroup = {
    groupId,
    name: `Homepage Group ${groupId.substring(0, 8)}`,
    shortDescription: `Homepage Group description ${groupId}`,
    homepage: `http://example.com/homepage-group-${groupId}`,
    avatarPath: "/static/images/profile-dark.svg",
    descriptionPath: "asapbio-scielo-preprint-crowd-review.md",
    slug: `slug-${groupId}`,
  };
  await callApi("api/add-group", homePageGroup);
  await callApi("api/update-group-details", {
    groupId: homePageGroup.groupId,
    largeLogoPath: "/static/images/home-page/prelights.svg",
  });
};

// coupled to backstop targets
const articleWithEvaluations = "10.1101/646810";
const articleWithCurationStatement = "10.1101/2022.02.23.481615";
const groupSlug = "pci-zoology";
const userHandle = "scietyHQ";
const userListId = "bcff0509-ad66-4868-a512-d762dd28f885";

// arbitrary data to populate pages
const groupA = {
  groupId: "ba6327db-d783-49a4-af23-deece25d4053",
  name: "Group A",
  shortDescription: "Group A description",
  homepage: "http://example.com/group-a",
  avatarPath: "/static/images/profile-dark.svg",
  descriptionPath: "asapbio-scielo-preprint-crowd-review.md",
  slug: groupSlug,
  issuedAt: "1970",
};
const evaluationA = {
  groupId: groupA.groupId,
  publishedAt: "1980",
  evaluationLocator: "hypothesis:evalA",
  articleId: articleWithEvaluations,
  authors: ["Rosalind Franklin", "Hilda Hänchen"],
  issuedAt: "2000",
};
const evaluationB = {
  groupId: groupA.groupId,
  publishedAt: "1980",
  evaluationLocator: "hypothesis:evalB",
  articleId: articleWithEvaluations,
  authors: ["Rosalind Franklin", "Hilda Hänchen"],
  issuedAt: "2001",
};
const evaluationC = {
  groupId: groupA.groupId,
  publishedAt: "1980",
  evaluationLocator: "hypothesis:evalC",
  articleId: articleWithCurationStatement,
  authors: ["Rosalind Franklin", "Hilda Hänchen"],
  issuedAt: "2002",
};
const evaluationD = {
  groupId: groupA.groupId,
  publishedAt: "1980",
  evaluationLocator: "hypothesis:evalD",
  articleId: articleWithCurationStatement,
  authors: ["Rosalind Franklin", "Hilda Hänchen"],
  issuedAt: "2003",
};
const curationStatementA = {
  groupId: groupA.groupId,
  publishedAt: "1980",
  evaluationLocator: "hypothesis:curationA",
  articleId: articleWithCurationStatement,
  authors: ["Rosalind Franklin", "Hilda Hänchen"],
  evaluationType: "curation-statement",
  issuedAt: "2004",
};
const curationStatementB = {
  groupId: groupA.groupId,
  publishedAt: "1980",
  evaluationLocator: "hypothesis:curationB",
  articleId: articleWithCurationStatement,
  authors: ["Rosalind Franklin", "Hilda Hänchen"],
  evaluationType: "curation-statement",
  issuedAt: "2005",
};
const scietyHqUser = {
  userId: "12345",
  handle: userHandle,
  avatarUrl: "/static/images/profile-dark.svg",
  displayName: "Sciety User",
  issuedAt: '2019'
};
const userList = {
  listId: userListId,
  ownerId: {
    tag: "user-id",
    value: scietyHqUser.userId,
  },
  name: "A second list",
  description: "Dolor sit amens",
};

const constructBackstopStateViaApi = async () => {
  await callApi("api/add-group", groupA);
  await pipe(groupsToHighlight, T.traverseSeqArray(stubHighlightedGroup))();
  await callApi("api/record-evaluation", evaluationA);
  await callApi("api/record-evaluation", evaluationB);
  await callApi("api/record-evaluation", evaluationC);
  await callApi("api/record-evaluation", evaluationD);
  await callApi("api/record-evaluation", curationStatementA);
  await callApi("api/record-evaluation", curationStatementB);
  await callApi("api/create-user", scietyHqUser);
  await callApi("api/create-list", userList);
  await callApi("api/add-article-to-list", {
    articleId: articleWithEvaluations,
    listId: userListId,
    issuedAt: "2020",
  });
  await callApi("api/add-article-to-list", {
    articleId: articleWithCurationStatement,
    listId: userListId,
    issuedAt: "2021",
  });
};

// eslint-disable-next-line func-names
void (async function () {
  await constructBackstopStateViaApi();
})();
