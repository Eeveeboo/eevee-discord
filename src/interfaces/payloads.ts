import { User } from "..";

export interface DiscordRawPayload<T = any> {
  t?: string | null;
  s?: number;
  op: number;
  d: T;
}
export interface DiscordHeartbeatPayload_10 extends DiscordRawPayload {
  op: 10;
  d: {
    heartbeat_interval: number;
    _trace: string[];
  };
}
export interface DiscordInvalidSessionPayload_9 extends DiscordRawPayload {
  op: 9;
  d: boolean;
}
export interface DiscordReadyPayload_1 extends DiscordRawPayload {
  t: "READY";
  op: 0;
  d: {
    v: number;
    user_settings: any;
    user: User;
    session_id: string;
    relationships: any[];
    private_channels: any[];
    presences: any[];
    guilds: {
      unavailable: boolean;
      id: string;
    }[];
    guild_join_requests: any[];
    geo_ordered_rtc_regions: string[];
    application: { id: string; flags: number };
    _trace: string[];
  };
}
