import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ColorResolvable,
    EmbedBuilder,
    ModalSubmitInteraction, PermissionsBitField
} from "discord.js";

type modalData = {
    value: string,
    type: number,
    customId: string,
    components: any | undefined;
}

const modalHandler = (interaction:ModalSubmitInteraction) => {
    if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) return;
    if(interaction.customId === "server-tokens-create-modal"){
        const title = interaction.fields.getField("server-tokens-embed-title") as modalData;
        const description = interaction.fields.getField("server-tokens-embed-description") as modalData;
        const thumbnail = interaction.fields.getField("server-tokens-embed-thumbnail") as modalData;
        const price = interaction.fields.getField("server-tokens-embed-price") as modalData;
        const color = interaction.fields.getField("server-tokens-embed-color") as modalData;
        const name = title.value.replace(" ", "_");
        if(isNaN(Number(price.value))) return;
        const embed = new EmbedBuilder()
            .setTitle(title.value)
            .addFields({name: "price", value: `> ${price.value} tokens`})
            .setColor("White");
        if(thumbnail.value.startsWith("http"))
            embed.setThumbnail(thumbnail.value);
        if(description.value !== '')
            embed.setDescription(description.value)
        try{
            if(color.value !== '')
                embed.setColor(color.value as ColorResolvable);
        }catch (err){}


        const button = new ButtonBuilder()
            .setCustomId(`server-tokens-remove-${price.value}-${name}`)
            .setLabel(`Buy now for ${price.value} tokens!`)
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button);

        if(interaction.channel != null)
            interaction.channel.send({embeds: [embed], components: [row]})
        interaction.reply({content: 'successfully created buy-able', ephemeral: true});
    }
}

export default modalHandler;