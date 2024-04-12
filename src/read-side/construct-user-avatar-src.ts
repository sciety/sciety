import { UserDetails } from '../types/user-details';

export const constructUserAvatarSrc = (user: UserDetails): string => `/users/${user.handle}/avatar`;
