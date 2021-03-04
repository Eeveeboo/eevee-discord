import EeveeDiscordClient from '../discord-client';
import { InteractionResponseType } from '../discord-interfaces';
const TOKEN = require('../../token.json');

const client = new EeveeDiscordClient(TOKEN);

/*client.on('raw',(p)=>{
    console.log('t',p.t);
    console.log('op',p.op);
    console.dir(p.d);
});*/

client.on('ready',()=>{
    console.log(client.guilds);
    client.guilds.forEach(g => {
        client.registerSlashCommand(
          {
            name: "banannies",
            description: "Creates a wall of bananas"
          },
          g
        );
    });
});

client.on('interaction',(i)=>{
    if(i.data?.name == "banannies"){
        client.respondToInteraction(i, {
          type: InteractionResponseType.AcknowledgeWithSource
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