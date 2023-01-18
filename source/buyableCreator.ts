import {
    ActionRowBuilder,
    ButtonInteraction, EmbedBuilder,
    ModalBuilder, PermissionsBitField, TextChannel,
    TextInputBuilder,
} from "discord.js";
const {Events,  TextInputStyle } = require('discord.js');

import modify_wallet from "./database/WalletOperations";
import {Sequelize} from "sequelize";
const textToActionRow = (textInputBuilder: TextInputBuilder): ActionRowBuilder<TextInputBuilder> => {
    const t = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(textInputBuilder);
    return t;
}
const createNameTextInput = new TextInputBuilder()
    .setLabel("Name")
    .setCustomId("server-tokens-embed-name")
    .setStyle(TextInputStyle.Short);
const createTitleTextInput = new TextInputBuilder()
    .setLabel("Title")
    .setCustomId("server-tokens-embed-title")
    .setStyle(TextInputStyle.Short);

const createDescriptionTextInput = new TextInputBuilder()
    .setLabel("Description")
    .setCustomId("server-tokens-embed-description")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

const createThumbnailTextInput = new TextInputBuilder()
    .setLabel("Thumbnail URL")
    .setCustomId("server-tokens-embed-thumbnail")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

const createPriceTextInput = new TextInputBuilder()
    .setLabel("Price")
    .setCustomId("server-tokens-embed-price")
    .setStyle(TextInputStyle.Short);

const createColorTextInput = new TextInputBuilder()
    .setLabel("Color")
    .setCustomId("server-tokens-embed-color")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

const createModal = new ModalBuilder()
    .setTitle("Embed info")
    .setCustomId("server-tokens-create-modal")
    .addComponents( textToActionRow(createTitleTextInput), textToActionRow(createDescriptionTextInput), textToActionRow(createThumbnailTextInput), textToActionRow(createPriceTextInput), textToActionRow(createColorTextInput));

const buttonHandler = async (interaction: ButtonInteraction, sequelize: Sequelize) => {
    const id = interaction.customId;

    if (!id.startsWith("server-tokens-")) return;


    switch (id) {
        case "server-tokens-create":
            if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) return;
            interaction.showModal(createModal.toJSON());
            break;
    }

    if (id.startsWith("server-tokens-remove-")) {
        const amount: number = parseInt(id.split("-")[3]);
        const item:string = id.split("-")[4];
        if (interaction.member !== null) {
            const success: boolean = await modify_wallet(interaction.member.user.id, "subtract", amount, sequelize) === 1_111_111_111;
            if (success) {
                const user = interaction.user;
                const embed = new EmbedBuilder()
                    .setTitle(`${user.username} bought an item!`)
                    .setColor("White")
                    .addFields(
                        {name: "user: ", value: `> <@${user.id}>`},
                        {name: "item: ", value: `> **${item}**`},
                        {name: "price: ", value: `> **${amount} tokens**`}
                    );

                let content:string = "<@&988094045756735550>";
                const rando = Math.ceil(Math.random() * 2);
                if(rando === 1){
                    content = '<@&988094045756735550> 😳';
                }
                const successBed = new EmbedBuilder()
                    .setDescription("```purchase successful, wait for an admin to dm you the prize!```");
               await interaction.reply({embeds: [successBed], ephemeral: true});
                await (interaction.client.channels.cache.get(process.env.CHANNEL_TO_SEND as string) as TextChannel).send({
                    embeds: [embed],
                    content: content
                })
            }else{
                const embed = new EmbedBuilder()
                    .setDescription("```You don't have enough tokens to buy that```");
                interaction.reply({embeds: [embed], ephemeral: true});
            }
        }

    }
}
export default buttonHandler;