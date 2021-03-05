import axios from "axios";
import { EventEmitter } from "ws";
import { ApplicationCommand, CreateApplicationCommand, DiscordRawPayload, DiscordReadyPayload_1, Feature, Interaction, InteractionResponse, InteractionResponseType } from "..";
import { axiosRetry } from "../utils";

export class SlashCommands extends Feature {
  name = "SlashCommands";
  api_base = this.client.api_base;
  token = "";
  clientId = "";
  private commands = {
    global: new Map<string, ApplicationCommand>(),
    guild: new Map<string, Map<string, ApplicationCommand>>(),
  };
  ready_init = async (p1: DiscordReadyPayload_1) => {
    // Load Commands
    this.token = this.client.token;
    this.clientId = p1.d.user.id;
    // Clear cache
    this.commands = {
      global: new Map<string, ApplicationCommand>(),
      guild: new Map<string, Map<string, ApplicationCommand>>(),
    };
  };
  handle_raw = async (p: DiscordRawPayload) => {
    //console.debug(p);
    if(p.op != 0) return;
    switch (p.t) {
      case "APPLICATION_COMMAND_CREATE":
      case "APPLICATION_COMMAND_UPDATE":
        var cmd = <ApplicationCommand>p.d;
        (cmd.guild_id
          ? this.commands.guild.get(cmd.guild_id)
          : this.commands.global
        )?.set(cmd.name, cmd);
        break;
      case "APPLICATION_COMMAND_DELETE":
        var cmd = <ApplicationCommand>p.d;
        (cmd.guild_id
          ? this.commands.guild.get(cmd.guild_id)
          : this.commands.global
        )?.delete(cmd.name);
        break;
      case "INTERACTION_CREATE":
        var int = <Interaction>p.d;
        this.emit('interaction', int);
        break;
    }
  };
  get = async (opts?: { commandID?: string; guildID?: string }) => {
    await this.ready;
    if (!opts) opts = {};
    // Check Cache
    var c2: Map<string, ApplicationCommand> | undefined | ApplicationCommand;
    if (opts.guildID) {
      c2 = this.commands.guild.get(opts.guildID);
    } else {
      c2 = this.commands.global;
    }

    if (opts.commandID && c2) {
      // Fetch One
      var c3 = await this._get(opts);
      c3.forEach((c) =>
        (opts?.guildID
          ? this.commands.guild.get(opts.guildID)
          : this.commands.global
        )?.set(c.name, c)
      );
    } else {
      // Fetch All
      var c3 = await this._get({ guildID: opts.guildID });
      var m1 = new Map<string, ApplicationCommand>();
      c3.forEach((c) => m1.set(c.name, c));
      if (opts.guildID) {
        this.commands.guild.set(opts.guildID, m1);
      } else {
        this.commands.global = m1;
      }
    }

    return opts.guildID
      ? opts.commandID
        ? this.commands.guild.get(opts.guildID)?.get(opts.commandID)
        : Array.from(this.commands.guild.get(opts.guildID)?.values() || [])
      : opts.commandID
      ? this.commands.global?.get(opts.commandID)
      : Array.from(this.commands.global.values() || []);
  };
  set = async (command: CreateApplicationCommand, guildID?: string) => {
    await this.ready;
    // Check if exists;
    await this.get({ guildID });
    var cmd = (guildID
      ? this.commands.guild.get(guildID)
      : this.commands.global
    )?.get(command.name);
    if(!cmd){
      cmd = await this._register(command,guildID);
    }else{
      cmd = await this._modify(command,cmd.id,guildID);
    }
    (guildID ? this.commands.guild.get(guildID) : this.commands.global)?.set(
      cmd.name, cmd
    );
    return cmd;
  };
  del = async (
    command: { name: string, guild_id?: string } | ApplicationCommand,
    guildID?: string
  ) => {
    await this.ready;
    // Check if exists;
    await this.get({ guildID: command.guild_id || guildID });
    var cmd = (command.guild_id || guildID
      ? this.commands.guild.get(command.guild_id || guildID || "")
      : this.commands.global
    )?.get(command.name);
    if (cmd) {
      (command.guild_id || guildID
        ? this.commands.guild.get(command.guild_id || guildID || "")
        : this.commands.global
      )?.delete(command.name);
      return await this._delete(cmd.id, command.guild_id || guildID);
    }
    return true;
  };
  respond = async (
    to: { id: string; token: string } | Interaction,
    resp?: InteractionResponse
  ) => {
    var url = `${this.client.api_base}/interactions/${to.id}/${to.token}/callback`;
    if(!resp) resp = { type: InteractionResponseType.Acknowledge }
    var res = await axios.post(url, resp);
    return res.data;
  };
  private _register = async (
    command: CreateApplicationCommand,
    guildID?: string
  ) => {
    const url = guildID
      ? `${this.api_base}/applications/${this.clientId}/guilds/${guildID}/commands`
      : `${this.api_base}/applications/${this.clientId}/commands`;

    const res = await axiosRetry({
      url,
      method: "POST",
      headers: { Authorization: `Bot ${this.token}` },
      data: command,
    });

    var c = <ApplicationCommand>res.data;
    return c;
  };
  private _modify = async (
    command: CreateApplicationCommand,
    commandID: string,
    guildID?: string
  ) => {
    const url = guildID
      ? `${this.api_base}/applications/${this.clientId}/guilds/${guildID}/commands/${commandID}`
      : `${this.api_base}/applications/${this.clientId}/commands/${commandID}`;

    const res = await axiosRetry({
      url,
      method: "PATCH",
      headers: { Authorization: `Bot ${this.token}` },
      data: command,
    });

    var c = <ApplicationCommand>res.data;
    return c;
  };
  private _delete = async (commandID: string, guildID?: string) => {
    const url = guildID
      ? `${this.api_base}/applications/${this.clientId}/guilds/${guildID}/commands/${commandID}`
      : `${this.api_base}/applications/${this.clientId}/commands/${commandID}`;

    const res = await axiosRetry({
      url,
      method: "DELETE",
      headers: { Authorization: `Bot ${this.token}` },
    });

    var c = <boolean>res.data;
    return c;
  };
  private _get = async (opts?: { commandID?: string; guildID?: string }) => {
    if (!opts) opts = {};
    let url = opts.guildID
      ? `${this.api_base}/applications/${this.clientId}/guilds/${opts.guildID}/commands`
      : `${this.api_base}/applications/${this.clientId}/commands`;

    if (opts.commandID) url += `/${opts.commandID}`;

    const res = await axiosRetry({
      url,
      method: "GET",
      headers: { Authorization: `Bot ${this.token}` },
    });

    var c = <ApplicationCommand[] | ApplicationCommand>res.data;
    if (!(c instanceof Array)) c = [c];
    return c;
  };
}

export interface SlashCommandEvents {
  error: (e: Error) => void;
  interaction: (interaction: Interaction) => void;
}
export declare interface SlashCommands {
  on<Event extends keyof SlashCommandEvents>(
    event: Event,
    listener: SlashCommandEvents[Event]
  ): this;
  emit<Event extends keyof SlashCommandEvents>(
    event: Event,
    ...args: Parameters<SlashCommandEvents[Event]>
  ): boolean;
}
