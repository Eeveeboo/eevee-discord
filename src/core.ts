import WebSocket from "ws";
import EventEmitter from "events";
import {
  getSlashCommands,
  modifySlashCommand,
  registerSlashCommand,
  respondToInteraction,
  unregisterSlashCommand,
} from "./phasing-out/old-interactionsupport";
import { DiscordHeartbeatPayload_10, DiscordInvalidSessionPayload_9, DiscordRawPayload, DiscordReadyPayload_1, Feature, Interaction, User } from ".";

export class EeveeCore extends EventEmitter {
  // @ts-ignore
  public ready: Promise<void>;
  public is_ready: boolean = false;
  private _set_ready: () => void = () => {};
  private _set_unready: (force?: boolean) => void = (force) => {
    if (this.is_ready) {
      this.is_ready = false;
      this.ready = new Promise<void>((done) => {
        this._set_ready = () => {
          if (!this.is_ready) {
            this.is_ready = true;
            done();
          }
        };
      });
    }
  };
  public user: User | null = null;
  public guilds: string[] = [];
  private ws: WebSocket | null = null;
  public token: string;
  private intents: number;
  private heartbeat: number | undefined;
  private heartbeat_seq: number | null = null;
  public api_base: string = "https://discord.com/api/v8";
  private session_id: string = "";
  private features: Map<string, Feature> = new Map();
  constructor(token: string, intents: number = 0) {
    super();
    this.token = token;
    this.intents = intents;
    this._set_unready(true);
    setImmediate(this._connect);
  }
  public _send_raw = (d: DiscordRawPayload) => {
    this.ws?.send(JSON.stringify(d));
  };
  private _connect = () => {
    this._call_featuresets_check_requires_and_set_unready();
    this.is_ready = false;
    clearInterval(this.heartbeat);
    this.ws = new WebSocket("wss://gateway.discord.gg?v=8&encoding=json", {
      perMessageDeflate: false,
    });
    this.ws.on("open", this._handle_open);
    this.ws.on("close", this._connect);
    this.ws.on("error", this._handle_error);
    this.ws.on("message", this._handle_message);
  };
  private _handle_open = () => {
    if (this.session_id) {
      // Attempt to resume
      this._send_raw({
        op: 6,
        d: {
          token: this.token,
          session_id: this.session_id,
          seq: this.heartbeat_seq,
        },
      });
    } else {
      // Create a new session
      this._send_raw({
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
    if (this.is_ready) {
      this.emit("raw", p);
      this._call_featuresets_handle_raw(p);
    }
    // Handle Heartbeat
    if (p.op == 10) {
      var p10 = <DiscordHeartbeatPayload_10>p;
      clearInterval(this.heartbeat);
      this.heartbeat = <number>(
        (<any>setInterval(this._hearbeat_ack, p10.d.heartbeat_interval))
      );
      this.emit("heartbeat", p10.d.heartbeat_interval);
      return;
    }
    if (p.op == 11) {
      // Hearbeat Ack
      return;
    }
    if (p.op == 0) {
      switch (p.t) {
        case "READY":
          var p1 = <DiscordReadyPayload_1>p;
          // Initalize Featuresets
          await this._call_featuresets_ready_init(p1);
          this.session_id = p1.d.session_id;
          this.user = p1.d.user;
          this.is_ready = true;
          console.log(this.user, this.is_ready);
          this.guilds = p1.d.guilds?.map((g) => g.id) || [];
          this._set_ready();
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
  };
  private _hearbeat_ack = () => {
    this._send_raw({
      op: 1,
      d: this.heartbeat_seq,
    });
  };
  private _handle_error = (e: Error) => {
    this.emit("error", e);
  };
  private _call_featuresets_check_requires_and_set_unready = () => {
    var errors: string[] = [];
    Array.from(this.features.values()).forEach((f) => {
      //@ts-ignore
      f.set_unready();
      f.requires.forEach((r) => {
        if (!this.features.has(r))
          errors.push(
            f.name + " requires the sibling feature " + r + " to run."
          );
      });
    });
    if (errors.length) throw errors.join("\n");
  };
  private _call_featuresets_ready_init = async (p1: DiscordReadyPayload_1) => {
    await Promise.all(
      Array.from(this.features.values()).map((f) =>
        // @ts-ignore
        f._ready_init ? f._ready_init(p1) : Promise.resolve()
      )
    );
  };
  private _call_featuresets_handle_raw = async (p: DiscordRawPayload) => {
    await Promise.all(
      Array.from(this.features.values()).map((f) =>
        f.handle_raw ? f.handle_raw(p) : Promise.resolve()
      )
    );
  };
  public register = <T extends Feature>(
    Feature: new (client: EeveeCore) => T
  ): T => {
    const feature = new Feature(this);
    if (this.is_ready) {
      // Check deps
      var errors: string[] = [];
      feature.requires.forEach((r) => {
        if (!this.features.has(r))
          errors.push(
            feature.name + " requires the sibling feature " + r + " to run."
          );
      });
      if (errors.length) throw errors.join("\n");
    }
    if (!feature.name)
      throw "You are required to set the name property in your FeatureSet.";
    this.features.set(feature.name, feature);
    return feature;
  };
  public respondToInteraction = respondToInteraction;
  public registerSlashCommand = registerSlashCommand;
  public modifySlashCommand = modifySlashCommand;
  public unregisterSlashCommand = unregisterSlashCommand;
  public getSlashCommands = getSlashCommands;
}

export interface DiscordClientEvents {
  ready: (payload: DiscordReadyPayload_1) => void;
  heartbeat: (heartbeat_interval: number) => void;
  interaction: (interaction: Interaction) => void;
  raw: (payload: DiscordRawPayload) => void;
  error: (e: Error) => void;
}
export declare interface EeveeCore {
  on<Event extends keyof DiscordClientEvents>(
    event: Event,
    listener: DiscordClientEvents[Event]
  ): this;
  emit<Event extends keyof DiscordClientEvents>(
    event: Event,
    ...args: Parameters<DiscordClientEvents[Event]>
  ): boolean;
}
