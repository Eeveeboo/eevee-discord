"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionResponseType = exports.InteractionType = exports.ApplicationCommandOptionType = void 0;
//#endregion
//#region Slash Commands
var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ApplicationCommandOptionType[ApplicationCommandOptionType["STRING"] = 3] = "STRING";
    ApplicationCommandOptionType[ApplicationCommandOptionType["INTEGER"] = 4] = "INTEGER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["BOOLEAN"] = 5] = "BOOLEAN";
    ApplicationCommandOptionType[ApplicationCommandOptionType["USER"] = 6] = "USER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["CHANNEL"] = 7] = "CHANNEL";
    ApplicationCommandOptionType[ApplicationCommandOptionType["ROLE"] = 8] = "ROLE";
})(ApplicationCommandOptionType = exports.ApplicationCommandOptionType || (exports.ApplicationCommandOptionType = {}));
var InteractionType;
(function (InteractionType) {
    InteractionType[InteractionType["PING"] = 1] = "PING";
    InteractionType[InteractionType["APPLICATION_COMMAND"] = 2] = "APPLICATION_COMMAND";
})(InteractionType = exports.InteractionType || (exports.InteractionType = {}));
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["Pong"] = 1] = "Pong";
    InteractionResponseType[InteractionResponseType["Acknowledge"] = 2] = "Acknowledge";
    InteractionResponseType[InteractionResponseType["ChannelMessage"] = 3] = "ChannelMessage";
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    InteractionResponseType[InteractionResponseType["AcknowledgeWithSource"] = 5] = "AcknowledgeWithSource";
})(InteractionResponseType = exports.InteractionResponseType || (exports.InteractionResponseType = {}));
//#endregion
