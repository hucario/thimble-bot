const { Command } = require('discord.js-commando');
const { Util: { parseEmoji } } = require('discord.js');
const parseTwemoji = require('twemoji-parser').parse;
const getEmojiName = require('emoji-dictionary').getName;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const meta = {
  name: 'emoji',
  aliases: [ 'e', 'getemoji', 'emote', 'getemote' ],
  description: 'Get the full size version of an emote.',
  examples: [ '`e :stuck_out_tongue:`' ],
  args: [
    {
      key: 'emote',
      prompt: 'What emote are you interested in?',
      type: 'string'
    }
  ]
};

class Emoji extends Command {
  constructor(client) {
    super(client, {
      ...meta,
      group: 'util',
      memberName: 'emoji',
      guildOnly: true,
      clientPermissions: [ 'ATTACH_FILES' ],
      userPermissions: [ 'ATTACH_FILES' ]
    });
  }

  async run(message, { emote }) {
    try {
      const target = parseEmoji(emote);

      if (target.animated) {
        const file = {
          attachment: `https://cdn.discordapp.com/emojis/${target.id}.gif`,
          name: `${target.name}.gif`
        };

        return message.say('', { file });
      }

      if (!target.id) {
        const tempDir = path.join(__dirname, '..', '..', 'temp');
        const twemoji = parseTwemoji(emote)[0];
        const emoteName = getEmojiName(emote);
        let filePath;

        return axios
          .get(twemoji.url, { responseType: 'arraybuffer' })
          .then(response => response.data)
          .then(image => {
            filePath = path.join(tempDir, `${emoteName}_${message.author.name}_${new Date().getTime()}.png`);
            return sharp(image, { density: 1024 })
              .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
              .png()
              .toFile(filePath);
          })
          .then(() => {
            return message.say('', {
              file: {
                attachment: filePath,
                name: `${emoteName}.png`
              }
            });
          })
          .then(function () {
            return fs.unlinkSync(filePath);
          })
          .then(() => null)
          .catch(function () {
            return message.say(':x: Something bad happened while fetching the emote.');
          });
      }

      const file = {
        attachment: `https://cdn.discordapp.com/emojis/${target.id}.png`,
        name: `${target.name}.png`
      };

      return message.say('', { file });
    } catch (err) {
      return message.say(':warning: Please provide a valid emote.');
    }
  }
};

module.exports = Emoji;
module.exports.meta = meta;
