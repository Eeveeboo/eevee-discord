/// <reference types="node" />
import EventEmitter from "events";
import { DiscordRawPayload, DiscordReadyPayload_1, User, Interaction, InteractionResponse, CreateApplicationCommand } from "./discord-interfaces";
import SlashCommands from "discord-slash-commands-client";
declare class EeveeDiscordClient extends EventEmitter {
    ready: boolean;
    user: User | null;
    guilds: string[];
    private ws;
    private token;
    private intents;
    private heartbeat;
    private heartbeat_seq;
    private api_base;
    private slash_command_manager;
    slash_commands: SlashCommands.ApplicationCommand[];
    private session_id;
    constructor(token: string, intents?: number);
    private _send;
    private _connect;
    private _handle_open;
    private _handle_message;
    private _hearbeat_ack;
    respondToInteraction: (interaction: {
        id: string;
        token: string;
    }, response: InteractionResponse) => Promise<import("axios").AxiosResponse<any>>;
    registerSlashCommand: (command: CreateApplicationCommand, guildId?: string | undefined) => Promise<SlashCommands.ApplicationCommand | undefined>;
    modifySlashCommand: (command: CreateApplicationCommand, commandId: string, guildId?: string | undefined) => Promise<SlashCommands.ApplicationCommand | undefined>;
    unregisterSlashCommand: (commandId: string, guildId?: string | undefined) => Promise<boolean | undefined>;
    getSlashCommands: (guildID?: string | undefined) => Promise<SlashCommands.ApplicationCommand[]>;
    getSlashCommand: (commandID?: string | undefined) => Promise<SlashCommands.ApplicationCommand[]>;
}
interface DiscordClientEvents {
    ready: (payload: DiscordReadyPayload_1) => void;
    heartbeat: (heartbeat_interval: number) => void;
    "heartbeat-ack": () => void;
    interaction: (interaction: Interaction) => void;
    raw: (payload: DiscordRawPayload) => void;
    "raw-unhandled": (payload: DiscordRawPayload) => void;
}
declare interface EeveeDiscordClient {
    on<Event extends keyof DiscordClientEvents>(event: Event, listener: DiscordClientEvents[Event]): this;
    emit<Event extends keyof DiscordClientEvents>(event: Event, ...args: Parameters<DiscordClientEvents[Event]>): boolean;
}
export default EeveeDiscordClient;
