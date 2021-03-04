"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_client_1 = __importDefault(require("../discord-client"));
var discord_interfaces_1 = require("../discord-interfaces");
var TOKEN = require('../../token.json');
var client = new discord_client_1.default(TOKEN);
/*client.on('raw',(p)=>{
    console.log('t',p.t);
    console.log('op',p.op);
    console.dir(p.d);
});*/
client.on('ready', function () {
    console.log(client.guilds);
    client.guilds.forEach(function (g) {
        client.registerSlashCommand({
            name: "banannies",
            description: "Creates a wall of bananas"
        }, g);
    });
});
client.on('interaction', function (i) {
    var _a;
    if (((_a = i.data) === null || _a === void 0 ? void 0 : _a.name) == "banannies") {
        client.respondToInteraction(i, {
            type: discord_interfaces_1.InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "🍌🍌🍌🍌🍌🍌🍌🍌\n🍌🍌🍌🍌🍌🍌🍌🍌\n🍌🍌🍌🍌🍌🍌🍌🍌\n🍌🍌🍌🍌🍌🍌🍌🍌\n🍌🍌🍌🍌🍌🍌🍌🍌\n🍌🍌🍌🍌🍌🍌🍌🍌\n🍌🍌🍌🍌🍌🍌🍌🍌",
            },
        });
    }
    /*client.respondToInteraction(i, {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: "```json\n"+JSON.stringify(i,null,2)+"\n```",
        }
    });*/
});
// Wait before I do that I need to have a way to register commands
