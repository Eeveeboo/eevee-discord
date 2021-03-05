import EeveeCore, {
  SlashCommands,
} from "..";
const TOKEN = require('../../token.json');

const client = new EeveeCore(TOKEN);
const slashCommands = client.register(SlashCommands);

client.on('ready',()=>{
    client.guilds.forEach(async g => {
      await slashCommands.set(
        {
          name: "command",
          description: "description",
        },
        g
      );
    });
});

slashCommands.on('interaction', (i)=>{
  slashCommands.respond(i);
});