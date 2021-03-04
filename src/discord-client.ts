import WebSocket from "ws";
import EventEmitter from "events";
import axios from "axios";
import {
  DiscordRawPayload,
  DiscordHearbeatPayload_10,
  DiscordReadyPayload_1,
  DiscordInvalidSessionPayload_9,
  User,
  Interaction,
  InteractionResponse,
  CreateApplicationCommand,
} from "./discord-interfaces";
import SlashCommands, {
  ApplicationCommand,
} from "discord-slash-commands-client";
import { FunctionUtil } from "./lib/FunctionUtil";

class EeveeDiscordClient extends EventEmitter {
  public ready: boolean = false;
  public user: User | null = null;
  public guilds: string[] = [];
  private ws: WebSocket | null = null;
  private token: string;
  private intents: number;
  private heartbeat: number | undefined;
  private heartbeat_seq: number | null = null;
  private api_base: string = "https://discord.com/api/v8/";
  private slash_command_manager: SlashCommands.Client | null = null;
  public slash_commands: SlashCommands.ApplicationCommand[] = [];
  private session_id: string = "";
  constructor(token: string, intents: number = 0) {
    super();
    this.token = token;
    this.intents = intents;
    this._connect();
  }
  private _send = (d: any) => {
    this.ws?.send(JSON.stringify(d));
  };
  private _connect = () => {
    this.ready = false;
    clearInterval(this.heartbeat);
    this.ws = new WebSocket("wss://gateway.discord.gg?v=8&encoding=json", {
      perMessageDeflate: false,
    });
    this.ws.on("open", this._handle_open);
    this.ws.on("close", this._connect);
    this.ws.on("message", this._handle_message);
  };
  private _handle_open = () => {
    if (this.session_id) {
      // Attempt to resume
      this._send({
        op: 6,
        d: {
          token: this.token,
          session_id: this.session_id,
          seq: this.heartbeat_seq,
        },
      });
    } else {
      // Create a new session
      this._send({
        op: 2,
        d: {
          token: this.token,
          intents: this.intents,
          properties: {
            $os: "linux",
            $browser: "eevee-discord-slash-commands-nodejs",
            $device: "eevee-discord-slash-commands-nodejs",
          },
        },
      });
    }
  };
  private _handle_message = async (data: WebSocket.Data) => {
    var p: DiscordRawPayload = JSON.parse(data.toString());
    // Save Sequence
    if (p.s) this.heartbeat_seq = p.s;
    // Handle Resume Failure
    if (p.op == 9) {
      // Bad session
      var p9 = <DiscordInvalidSessionPayload_9>p;
      if (!p9.d) {
        this.session_id = "";
        this._handle_open();
      }
      return;
    }
    // Emit Raw Event
    this.emit("raw", p);
    // Handle Heartbeat
    if (p.op == 10) {
      var p10 = <DiscordHearbeatPayload_10>p;
      clearInterval(this.heartbeat);
      this.heartbeat = <number>(
        (<any>setInterval(this._hearbeat_ack, p10.d.heartbeat_interval))
      );
      this.emit("heartbeat", p10.d.heartbeat_interval);
      return;
    }
    if (p.op == 11) {
      this.emit("heartbeat-ack");
      return;
    }
    if (p.op == 0) {
      switch (p.t) {
        case "READY":
          var p1 = <DiscordReadyPayload_1>p;
          console.log(p1);
          this.session_id = p1.d.session_id;
          this.user = p1.d.user;
          this.ready = true;
          console.log(this.user, this.ready);
          this.guilds = p1.d.guilds?.map((g) => g.id) || [];
          this.slash_command_manager = new SlashCommands.Client(
            this.token,
            this.user.id
          );
          var _slash_commands = await this.slash_command_manager.getCommands();
          if (!(_slash_commands instanceof Array))
            _slash_commands = [_slash_commands];
          this.slash_commands = _slash_commands;
          this.emit("ready", p1);
          return;
      }
    }
    // Handle Dispatch
    if (p.op == 0) {
      switch (p.t) {
        case "INTERACTION_CREATE":
          var interaction = <Interaction>p.d;
          this.emit("interaction", interaction);
          return;
      }
    }
    this.emit("raw-unhandled", p);
  };
  private _hearbeat_ack = () => {
    this._send({
      op: 1,
      d: this.heartbeat_seq,
    });
  };
  public respondToInteraction = async (
    interaction: { id: string; token: string },
    response: InteractionResponse
  ) => {
    var url =
      this.api_base +
      "interactions/" +
      interaction.id +
      "/" +
      interaction.token +
      "/callback";
    console.log(url);
    return axios.post(url, response);
  };
  public registerSlashCommand = async (
    command: CreateApplicationCommand,
    guildId?: string
  ) => {
    return this.slash_command_manager?.createCommand(<any>command, guildId);
  };
  public modifySlashCommand = async (
    command: CreateApplicationCommand,
    commandId: string,
    guildId?: string
  ) => {
    return this.slash_command_manager?.editCommand(
      <any>command,
      commandId,
      guildId
    );
  };
  public unregisterSlashCommand = async (
    commandId: string,
    guildId?: string
  ) => {
    return this.slash_command_manager?.deleteCommand(commandId, guildId);
  };
  public getSlashCommands = async (guildID?: string) => {
    return this.slash_command_manager?.getCommands({ guildID });
  };
  public getSlashCommand = async (commandID?: string) => {
    return this.slash_command_manager?.getCommands({ commandID });
  };
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
  on<Event extends keyof DiscordClientEvents>(
    event: Event,
    listener: DiscordClientEvents[Event]
  ): this;
  emit<Event extends keyof DiscordClientEvents>(
    event: Event,
    ...args: Parameters<DiscordClientEvents[Event]>
  ): boolean;
}

export default EeveeDiscordClient;
