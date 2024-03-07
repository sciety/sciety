import { CreateUserAccountForm } from './codecs';
import { CreateUserAccountCommand } from '../../../write-side/commands';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

export const toCommand = (inputs: CreateUserAccountForm, userId: CreateUserAccountCommand['userId']): CreateUserAccountCommand => (
  {
    handle: inputs.handle,
    displayName: inputs.fullName,
    userId,
    avatarUrl: defaultSignUpAvatarUrl,
  });
