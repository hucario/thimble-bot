// TODO: Unify togglers

const { Command } = require('discord.js-commando');
const BoopOptout = require('../../db/models/boops/Optout');

const meta = {
  name: 'toggleboop',
  aliases: [ 'toggleboops' ],
  description: 'Allow or disable getting booped.'
};

class ToggleBoopCommand extends Command {
  constructor(client) {
    super(client, {
      ...meta,
      group: 'boop',
      memberName: 'toggleboop',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 30 * 60
      }
    });
  }

  getCurrentState(userId, guild) {
    return BoopOptout.count({ where: { userId, guild, type: 'boop' } });
  }

  enableBoops(userId, guild) {
    return BoopOptout.destroy({ where: { userId, guild, type: 'boop' } });
  }

  disableBoops(userId, guild) {
    return BoopOptout.create({ userId, guild, type: 'boop' });
  }

  async toggle(userId, guild) {
    switch (this.currentState) {
      case 0: // boops are enabled
        await this.disableBoops(userId, guild);
        break;
      case 1: // boops are disabled
        await this.enableBoops(userId, guild);
        break;
    }
  }

  getMessage(author) {
    switch (this.currentState) {
      case 0: // boops are enabled
        return `${author.toString()}, boops have been disabled successfully.`;
      case 1: // boops are disabled
        return `${author.toString()}, boops have been enabled successfully.`;
    }
  }

  async run(message) {
    console.log(this.throttle(message.author.id));

    const userId = message.author.id;
    const guild = message.guild.id;

    try {
      this.currentState = await this.getCurrentState(userId, guild);

      await this.toggle(userId, guild);

      return message.say(await this.getMessage(message.author));
    } catch (err) {
      console.error(err);
      return message.say(':x: Failed to toggle boop state.');
    }
  }
};

module.exports = ToggleBoopCommand;
module.exports.meta = meta;
