import axios from "axios";
import {
  InteractionResponse,
  CreateApplicationCommand,
  ApplicationCommand,
} from "..";
import { EeveeCore } from "../core";
import { axiosRetry } from "../utils";

export async function respondToInteraction(
  this: EeveeCore,
  interaction: { id: string; token: string },
  response: InteractionResponse
) {
  var url =
    this.api_base +
    "/interactions/" +
    interaction.id +
    "/" +
    interaction.token +
    "/callback";
  return axios.post(url, response);
}
export async function registerSlashCommand(
  this: EeveeCore,
  command: CreateApplicationCommand,
  guildID?: string,
) {
  if (!this.user)
    throw new Error(
      "Slash commands are unavalible until the bot has connected and reached the READY state."
    );
  const url = guildID
    ? `${this.api_base}/applications/${this.user.id}/guilds/${guildID}/commands`
    : `${this.api_base}/applications/${this.user.id}/commands`;

  const res = await axiosRetry({
    url,
    method: "POST",
    headers: { Authorization: `Bot ${this.token}` },
    data: command
  });

  var c = <ApplicationCommand>res.data;
  return c;
}
export async function modifySlashCommand(
  this: EeveeCore,
  command: CreateApplicationCommand,
  commandID: string,
  guildID?: string
) {
  if (!this.user)
    throw new Error(
      "Slash commands are unavalible until the bot has connected and reached the READY state."
    );
  if (guildID && typeof guildID !== "string")
    throw (
      "guildID received but wasn't of type string. received: " + typeof guildID
    );
  const url = guildID
    ? `${this.api_base}/applications/${this.user.id}/guilds/${guildID}/commands/${commandID}`
    : `${this.api_base}/applications/${this.user.id}/commands/${commandID}`;

  const res = await axiosRetry({
    url,
    method: "PATCH",
    headers: { Authorization: `Bot ${this.token}` },
    data: command,
  });

  var c = <ApplicationCommand>res.data;
  return c;
}
export async function unregisterSlashCommand(
  this: EeveeCore,
  commandID: string,
  guildID?: string
) {
  if (!this.user)
    throw new Error(
      "Slash commands are unavalible until the bot has connected and reached the READY state."
    );
  if (guildID && typeof guildID !== "string")
    throw (
      "guildID received but wasn't of type string. received: " + typeof guildID
    );
  const url = guildID
    ? `${this.api_base}/applications/${this.user.id}/guilds/${guildID}/commands/${commandID}`
    : `${this.api_base}/applications/${this.user.id}/commands/${commandID}`;

  const res = await axiosRetry({
    url,
    method: "DELETE",
    headers: { Authorization: `Bot ${this.token}` }
  });

  var c = <boolean>res.data;
  return c;
}
export async function getSlashCommands(
  this: EeveeCore,
  opts: { commandID?: string; guildID?: string }
) {
  if(!this.user) throw new Error("Slash commands are unavalible until the bot has connected and reached the READY state.");
  let url = opts.guildID
    ? `${this.api_base}/applications/${this.user?.id}/guilds/${opts.guildID}/commands`
    : `${this.api_base}/applications/${this.user?.id}/commands`;

  if (opts.commandID) url += `/${opts.commandID}`;

  const res = await axiosRetry({url,method:"GET",
    headers: { Authorization: `Bot ${this.token}` },
  });

  var c = <ApplicationCommand[] | ApplicationCommand>res.data;
  if (!(c instanceof Array)) c = [c];
  return c;
}