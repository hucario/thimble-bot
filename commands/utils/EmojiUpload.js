const { Command } = require('discord.js-commando');

class EmojiUpload extends Command {
  constructor(client) {
    super(client, {
      name: 'emojiupload',
      aliases: [ 'emoteupload', 'emojiup', 'emoteup', 'addemoji', 'addemote' ],
      group: 'utils',
      memberName: 'emojiupload',
      description: 'Upload an emoji to the server',
      args: [
        {
          key: 'name',
          prompt: 'What do you want to call this emoji?',
          type: 'string'
        }
      ]
    });
  }

  async run(message, { name }) {
    if (!message.attachments.size) {
      return message.say(':warning: You need to provide an image to upload as an emote.');
    }

    const existing = await message.guild.emojis.find('name', name);

    if (existing) {
      return message.say(':warning: An emoji with this name already exists.');
    }

    const image = await message.attachments.first();

    try {
      const emote = await message.guild.createEmoji(image.url, name);
      return message.say(`${emote} \`:${name}:\` emoji added to the server!`);
    } catch (err) {
      return message.say(':warning: Failed to add emoji at the moment.');
    }
  }
};

module.exports = EmojiUpload;
