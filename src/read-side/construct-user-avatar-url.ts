import { UserDetails } from '../types/user-details';

export const constructUserAvatarUrl = (user: UserDetails): string => `/users/${user.handle}/avatar`;
