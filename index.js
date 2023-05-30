import fetch from 'node-fetch';
import dotenv from 'dotenv';

import { Client, Intents, Guild, BitField, MessageEmbed, MessageAttachment } from 'discord.js';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.on("ready", () => {
    console.log("The bot is ready");
    bot.user.setActivity("!info", {type: 'WATCHING'});
});

bot.on('messageCreate', async message => {
    if(!message.content.startsWith("!" || message.author.bot)) return;

    const args = message.content.slice(1).split(/ + /);
    const command = args.shift().toLocaleLowerCase();

    if(command === 'info'){
        let [price, liquid, transactions, holders, mc, burned, circulatingSupply, change24, trend] = await getPrice();


        const messageToBeSent = new MessageEmbed()
             .setColor('#655dff')
             .setTitle('CYBR Token Info')
             .setURL('https://thecyberenterprise.com/en/')
             .setAuthor('www.TheCyberEnterprise.com', 'https://i.imgur.com/oDZJsgu.png', 'https://thecyberenterprise.com/')
             .setDescription('Here is where we are so far!')
             .addField('CYBR Price: ', price)
             .addField('Total Liquidity: ', liquid)
             .addField('Market Cap: ', mc)
             .addField('Circulating Supply: ', circulatingSupply)
             .addField('24 Hour Change: ', change24.toString())
             .addField('Token Trend: ', trend.toUpperCase())
             .addField('Total Burned: ', burned)
             .addField('Total Transactions: ', transactions)
             .addField('Total Holders: ', holders)
             .setFooter('The Cyber Team', 'https://i.imgur.com/oDZJsgu.png');

        message.channel.send({ embeds: [messageToBeSent] });

    }
});

async function getPrice() {
    try {	
    const url = "https://api.thecyberenterprise.com/get_info.php";
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    }).then((response) => {
	    return response.json();
    });
    const data = await response;

    let price = data.usdPrice;
    let liquid = data.totalLiquidity;
    let transactions = data.totalTransactions;
    let holders = data.holders;
    let mc = data.dilutedMarketCap;
    let burned = data.burnedAmmount;
    let circulatingSupply = data.circulatingSupplyFormated;
    let change24 = data.difference24;
    let trend = data.trend;

    return [price, liquid, transactions, holders, mc, burned, circulatingSupply, change24, trend];
    } catch(error) {
        console.log(error);
        getPrice();
    }
}

bot.login(process.env.DISCORD_BOT_TOKEN);