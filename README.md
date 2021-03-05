# Eevee Discord Client

This library gives easy access to the raw discord gateway payloads and I recommend using it only to fill in for missing features

This library is split into featuresets so that you only import the features you need.

---
## Installation
```bash
npm i eevee-discord
```
---
## Documentation

Documentation is currently a WIP.


You can see the current documentation on my [github pages](https://eeveeboo.github.io/eevee-discord/)

---

## Basic Usage
```ts
import EeveeCore, {
  SlashCommands,
} from "eevee-discord";
const TOKEN = require('../token.json');

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
// To handle all raw packets
eevee.on('raw', (payload)=>{
    
});
```
---
## Note from the Author
This is a small library originally conceived for utilizing discord slash commands and potentially other functions in the discord API that haven't been exposed in popular libraries yet. In the future I do plan on making it more full featured and suited for stateless sharded bots where memory and raw speed are required.

---