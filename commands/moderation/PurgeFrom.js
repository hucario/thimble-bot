const { Command } = require('discord.js-commando');

const meta = {
  name: 'purgefrom',
  description: 'Purge all messages starting from a given message ID.',
  aliases: [ 'clearfrom', 'deletefrom' ],
  examples: [ '`purgefrom 123456`' ],
  args: [
    {
      key: 'id',
      prompt: 'Where should I start?',
      type: 'string'
    }
  ]
};

class PurgeFrom extends Command {
  constructor(client) {
    super(client, {
      ...meta,
      group: 'moderation',
      memberName: 'purgefrom',
      guildOnly: true,
      userPermissions: [ 'MANAGE_MESSAGES' ]
    });
  }

  async run(message, { id }) {
    if (!parseInt(id)) {
      return message.say(':warning: Invalid message ID supplied.');
    }

    const targetMessage = await message.channel.fetchMessage(id);
    if (!targetMessage) {
      return message.say(':x: Could not delete messages. Maybe the provided message does not exist?');
    }

    const messages = await message.channel.fetchMessages()
      .then(messages => messages.filter(m => m.createdTimestamp >= targetMessage.createdTimestamp));

    if (messages.size < 2) {
      return message.say(':x: Cannot delete less than 2 messages.');
    }

    if (messages.size > 100) {
      return message.say(':x: Cannot delete more than 100 messages.');
    }

    message.channel.bulkDelete(messages);
    const success = await message.say(`:recycle: Successfully deleted ${messages.size} messages!`);

    setTimeout(() => success.delete(), 2000);

    return null;
  }
};

module.exports = PurgeFrom;
module.exports.meta = meta;
