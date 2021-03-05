import { AllowedMentions, Embed, GuildMember, User } from "..";

export enum ApplicationCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
}
export interface CreateApplicationCommand {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
}
export interface ApplicationCommand {
  id: string;
  application_id: string;
  name: string;
  description: string;
  guild_id?: string;
  options?: ApplicationCommandOption[];
}
export interface ApplicationCommandOption {
  type: ApplicationCommandOptionType;
  /**
   * 1-32 character name matching ^[\w-]{1,32}$
   *
   * @type {string}
   * @memberof ApplicationCommandOption
   */
  name: string;
  /**
   * 1-100 character description
   *
   * @type {string}
   * @memberof ApplicationCommandOption
   */
  description: string;
  default?: boolean;
  required?: boolean;
  /**
   * choices for string and int types for the user to pick from
   *
   * @type {ApplicationCommandOptionChoice[]}
   * @memberof ApplicationCommandOption
   */
  choices?: ApplicationCommandOptionChoice[];
  /**
   * if the option is a subcommand or subcommand group type, this nested options will be the parameters
   *
   * @type {ApplicationCommandOption[]}
   * @memberof ApplicationCommandOption
   */
  options?: ApplicationCommandOption[];
}
export interface ApplicationCommandOptionChoice {
  /**
   * 1-100 character choice name
   *
   * @type {string}
   * @memberof ApplicationCommandOptionChoice
   */
  name: string;
  /**
   * value of the choice
   *
   * @type {(string|number)}
   * @memberof ApplicationCommandOptionChoice
   */
  value: string | number;
}
export interface Interaction {
  /**
   * read-only property, always 1
   *
   * @type {1}
   * @memberof DiscordInteractionDispatch
   */
  version: 1;
  /**
   * the type of interaction
   *
   * @type {InteractionType}
   * @memberof DiscordInteractionDispatch
   */
  type: InteractionType;
  /**
   * a continuation token for responding to the interaction
   *
   * @type {string}
   * @memberof DiscordInteractionDispatch
   */
  token: string;
  /**
   * guild member data for the invoking user, including permissions
   *
   * @type {GuildMember}
   * @memberof DiscordInteractionDispatch
   */
  member?: GuildMember;
  /**
   * user object for the invoking user, if invoked in a DM
   *
   * @type {User}
   * @memberof DiscordInteractionDispatch
   */
  user?: User;
  /**
   * id of the interaction
   *
   * @type {string}
   * @memberof DiscordInteractionDispatch
   */
  id: string;
  /**
   * the guild it was sent from
   *
   * @type {string}
   * @memberof DiscordInteractionDispatch
   */
  guild_id?: string;
  /**
   * the command data payload
   *
   * @type {ApplicationCommandInteractionData}
   * @memberof DiscordInteractionDispatch
   */
  data?: ApplicationCommandInteractionData;
  /**
   * the channel it was sent from
   *
   * @type {string}
   * @memberof DiscordInteractionDispatch
   */
  channel_id?: string;
}
export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
}
export interface ApplicationCommandInteractionData {
  /**
   * the params + values from the user
   *
   * @type {ApplicationCommandInteractionDataOption[]}
   */
  options: ApplicationCommandInteractionDataOption[];
  /**
   * the name of the invoked command
   *
   * @type {string}
   */
  name: string;
  /**
   * the ID of the invoked command
   *
   * @type {string}
   */
  id: string;
  resolved?: {
    users?: { [id: string]: User };
    members?: { [id: string]: GuildMember }[];
  };
}
export interface ApplicationCommandInteractionDataOption {
  name: string;
  value?: ApplicationCommandOptionType;
  options?: ApplicationCommandInteractionDataOption[];
}
export interface InteractionResponse {
  type: InteractionResponseType;
  data?: InteractionApplicationCommandCallbackData;
}
export enum InteractionResponseType {
  Pong = 1,
  Acknowledge = 2,
  ChannelMessage = 3,
  ChannelMessageWithSource = 4,
  AcknowledgeWithSource = 5,
}
export interface InteractionApplicationCommandCallbackData {
  tts?: boolean;
  content: string;
  embeds?: Embed[];
  allowed_mentions?: AllowedMentions;
}
