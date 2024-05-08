import { FormBody } from './form-body';
import { CreateUserAccountCommand } from '../../../write-side/commands';
import { UserHandle } from '../../../types/user-handle';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

export const toCommand = (inputs: FormBody, userId: CreateUserAccountCommand['userId']): CreateUserAccountCommand => (
  {
    handle: inputs.handle.content as UserHandle,
    displayName: inputs.fullName.content,
    userId,
    avatarUrl: defaultSignUpAvatarUrl,
  });
