import { callApi } from './../feature-test/helpers/call-api.helper';
import {DescriptionPath} from '../src/types/description-path';
import {fromValidatedString} from '../src/types/group-id';
import {AddGroupCommand} from '../src/write-side/commands';

const constructBackstopStateViaApi = async () => {
    const groupA: AddGroupCommand = {
        groupId: fromValidatedString('ba6327db-d783-49a4-af23-deece25d4053'),
        name: 'Group A',
        shortDescription: 'Group A description',
        homepage: 'http://example.com/group-a',
        avatarPath: '/static/images/profile-dark.svg',
        descriptionPath: 'asapbio-scielo-preprint-crowd-review.md' as DescriptionPath,
        slug: 'groupA',
        largeLogoPath: '/static/groups/large-logos/access-microbiology.png',
      }
    await callApi('api/add-group', groupA)
};

// eslint-disable-next-line func-names
void (async function () { await constructBackstopStateViaApi(); }());
