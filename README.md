# Eevee Discord Client
### This library gives easy access to the raw discord gateway payloads and I recommend using it only to fill in for missing features
Documentation is currently a WIP.
## Installation
```bash
npm i eevee-discord
```

## Basic Usage
```ts
import EeveeDiscordClient {
    ApplicationCommandOptionType
} from 'eevee-discord';

// Create a client
const eevee = new EeveeDiscordClient(
    process.env.DISCORD_TOKEN,
    Number(process.env.DISCORD_INTENTS)
);

eevee.on('ready', async (payload)=>{
    // Interactions are unavalible until the bot is 'ready'
    var commands = await eevee
    .getSlashCommands({});
    if(!commands.find(c=>c.name=="thank"))
        await eevee
        .registerSlashCommand(
            {
                name: "thank",
                description: "Thank a user",
                options: [
                {
                    name: "user",
                    description: "User to thank",
                    type: ApplicationCommandOptionType.USER,
                    required: true,
                },
                ],
            }
        );
});

// To handle clash command interactions specifically 
eevee.on('interaction', (interaction)=>{
    if(interaction.data?.name == "thank") 
        eevee.respondToInteraction(interaction, {
            type: InteractionResponseType.AcknowledgeWithSource,
            data:{
                content: `<@${i.user?.id}> thanks <@${interaction.data?.options[0].value}> ♥`
            }
        });
});

// To handle all raw packets
eevee.on('raw', (payload)=>{
    
});
```

## Note from the Author
This is a small library originally conceived for utilizing discord slash commands and potentially other functions in the discord API that haven't been exposed in popular libraries yet. In the future I do plan on making it more full featured and suited for stateless sharded bots where memory and raw speed are required.