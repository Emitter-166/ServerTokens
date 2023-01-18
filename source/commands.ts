import {ButtonBuilder, EmbedBuilder, Message, ActionRowBuilder, ButtonStyle, PermissionsBitField} from "discord.js";
import modify_wallet from "./database/WalletOperations";
import {Sequelize} from "sequelize";
const commandHandler = async (msg: Message, sequelize: Sequelize): Promise<void> => {
try{
   const content = msg.content;
   const args = content.split(" ");
   if (!(args[0] === "!tokens")) return;

   if (args[1] === "bal") {
      const bal = await modify_wallet(msg.member?.user.id as string, "none", 0, sequelize);
      let description:string;
      if(bal> 999){
         description = `You have ${bal} tokens in your wallet, pretty rich 😳`;
      }else{
         description = `You have ${bal} tokens in your wallet`
      }
      const replyEmbed = new EmbedBuilder()
          .setAuthor({
             iconURL: msg.member?.avatarURL() as string,
             name: msg.member?.user.username as string + "#" + msg.member?.user.discriminator
          })
          .setDescription("```" + description + "```")
          .setTimestamp(new Date()).toJSON();

      await msg.reply({embeds: [replyEmbed]});
      return;
   }
   if(!msg.member?.permissions?.has(PermissionsBitField.Flags.Administrator)) return;

   switch (args[1]) {
      case "give":
         if (args.length < 4) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("```please include an amount and user!```").toJSON();
           await msg.reply({embeds: [embed]});
            return;
         }
         const userId = args[2].replace("<", "").replace("@", "").replace(">", "").replace("!", "");
         const bal = await modify_wallet(userId, "add", parseInt(args[3]), sequelize);

         const guild = msg.guild;
         if(guild === null) return;
         const member = guild.members.cache.get(userId);
         if(member === undefined) return;

         const description = `Added ${args[3]} to ${member.user.username}'s wallet \nThey now have a total of ${bal} tokens`
         const replyEmbed = new EmbedBuilder()
             .setAuthor({
                url: msg.member?.avatar as string,
                name: msg.member?.user.username as string + msg.member?.user.discriminator
             })
             .setDescription("```" + description + "```")
             .setTimestamp(new Date());

         await msg.reply({embeds: [replyEmbed]});
         break;
      case "create":
         const createBed = new EmbedBuilder()
             .setTitle("Create a buy-able");
         const createButton = new ButtonBuilder()
             .setStyle(ButtonStyle.Success)
             .setLabel("create")
             .setCustomId("server-tokens-create");
         const createComp = new ActionRowBuilder<ButtonBuilder>()
             .addComponents(createButton);

         await msg.reply({components:[createComp], embeds: [createBed]});
         break;
      case "remove":
         if (args.length < 4) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("```please include an amount and user!```").toJSON();
           await msg.reply({embeds: [embed]});
            return;
         }

         const userId1 = args[2].replace("<", "").replace("@", "").replace(">", "").replace("!", "");
         const bal1 = await modify_wallet(userId1, "subtractWithBal", parseInt(args[3]), sequelize);

         const guild1 = msg.guild;
         if(guild1 === null) return;
         const member1 = guild1.members.cache.get(userId1);
         if(member1 === undefined) return;

         const description1 = `Removed ${args[3]} from ${member1.user.username}'s wallet \nThey now have a total of ${bal1} tokens`
         const replyEmbed1 = new EmbedBuilder()
             .setAuthor({
                url: msg.member?.avatar as string,
                name: msg.member?.user.username as string + msg.member?.user.discriminator
             })
             .setDescription("```" + description1 + "```")
             .setTimestamp(new Date());

         await msg.reply({embeds: [replyEmbed1]});
         break;

      case "help":
         const helpbed = new EmbedBuilder()
             .setTitle("Commands for server tokens")
             .setDescription("```" +
                 "!tokens give user amount --> add tokens to someones wallet\n" +
                 "!tokens remove user amount --> remove tokens from someones wallet\n" +
                 "!tokens create --> create a buy-able```");
         await msg.reply({embeds: [helpbed]});

   }
}catch (err){
   console.log(err)
}
}

export default commandHandler;