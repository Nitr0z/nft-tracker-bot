const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const token = require("./token.json")
const prefix = require("./config.json");
const Web3 = require('web3');
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/a7d1163123a14aa88c936edaf6b3f114');

// début du code
client.on('ready', () => {
    console.log('Bot ok');
  });
  
  client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
      const args = message.content.slice(prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();
  
      if (!client.commands.has(command)) return;
  
      try {
        client.commands.get(command).execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("Une erreur s'est produite pendant l'exécution de la commande !");
      }
  })
  
  client.login(token.token);



 // ----------------------------------------------------------------------------------------------------------------------------------------------------------
  // regarder toutes les 5 mins s'il y à une nouvelle transaction sur l'adresse 0x4510ef604e0595f7151adcba0b958d39b8b16d40
//  setInterval(async function(){
    var subscription = web3.eth.subscribe('logs', {
      address: '0x28AaF29992B43e093A7D883c7427bd1fF4a6665b',
  });

  subscription.on('data', event => {
    if (event.topics.length == 4) {
        let transaction = web3.eth.abi.decodeLog([{
            type: 'address',
            name: 'from',
            indexed: true
        }, {
            type: 'address',
            name: 'to',
            indexed: true
        }, {
            type: 'uint256',
            name: 'tokenId',
            indexed: true
        }],
            event.data,
            [event.topics[1], event.topics[2], event.topics[3]]);


        console.log(`\n` +
            `From: ${(transaction.from === '0x0000000000000000000000000000000000000000') ? 'New mint!' : transaction.from}\n` +
            `To: ${transaction.to}\n` +
            `Token ID: ${transaction.tokenId}`
        );

        // mettre dans des variables
        var from = transaction.from;
        var to = transaction.to;
        var tokenId = transaction.tokenId;


        // récuperer le prix de la transaction
        web3.eth.getTransaction(event.transactionHash).then((transaction) => {
            const channel = client.channels.cache.get('854840063988203570');
            const embed8 = new Discord.MessageEmbed()
            // mettre le titre de l'embed avec l'id du token
            .setTitle('** Dark Taverns #'+tokenId+'** has been sold !')
            // ajout d'une url vers opensea avec le token id
            .setURL('https://opensea.io/assets/0x28aaF29992B43e093A7D883c7427bd1fF4a6665b/'+tokenId)
            // display price in eth and usd
            .addFields(
                { name: 'Price : ' , value: '' + web3.utils.fromWei(transaction.value, 'ether') + ' ETH ($)'},)
            .addFields(
                { name: 'From : ', value: '' +from+ ''},)
            .addFields(
                { name: 'To : ', value: '' +to+ ''},)
            // ajouter l'image 
            .setImage('https://images-ext-1.discordapp.net/external/6duDU5N4AmMfhbPRK75syzwwXqjWVbPtwgI9oHQE6o0/https/miro.medium.com/max/1200/1%2AgUTWfOQ5baxs4H8NJ-Z1vA.png?width=671&height=671')
            // footer afficher nom collection & date du jour en anglais
            .setFooter('Dark Taverns | '+new Date().toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
            .setColor('RANDOM')
            channel.send(embed8)
        });

        // recuperer la taille dans les metadatas



    }
})
  
  
