if(process.env.DISCORD_WEBHOOK === undefined) {
    console.log("WARNING WEBHOOK NOT DEFINED");
} else {
    const { Webhook } = require('../node_modules/discord-webhook-node');
    const hook = new Webhook(process.env.DISCORD_WEBHOOK);
    
    hook.setUsername('MapsNotIncluded API');
     
    hook.send("New Instance!");
    
    module.exports = hook;
}
