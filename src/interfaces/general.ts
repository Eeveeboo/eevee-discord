export interface User {
  verified?: boolean;
  username: string;
  mfa_enabled?: boolean;
  id: string;
  flags?: number;
  email?: null | string;
  discriminator: string;
  bot?: boolean;
  avatar: null | string;
  system?: boolean;
  locale?: string;
  premium_type?: number;
  public_flags?: number;
}
export interface GuildMember {
  user: User;
  roles: string[];
  premium_since: string;
  permissions: string;
  pending?: boolean;
  nick?: string;
  mute: boolean;
  joined_at: string;
  is_pending: boolean;
  deaf: boolean;
}
export interface AllowedMentions {
  roles: boolean;
  users: boolean;
  everyone: boolean;
}

