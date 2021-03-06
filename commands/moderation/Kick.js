const { Command } = require('discord.js-commando');

const meta = {
  name: 'kick',
  description: 'Kick a member.',
  examples: [
    '`kick @someone#1234` - Kick someone',
    '`kick @someone#1234 reason` - Kick someone with a reason'
  ],
  args: [
    {
      key: 'user',
      prompt: 'Who do you want to kick?',
      type: 'user'
    },
    {
      key: 'reason',
      prompt: 'Why do you want to kick this member?',
      default: '',
      type: 'string'
    }
  ]
};

class Kick extends Command {
  constructor(client) {
    super(client, {
      ...meta,
      group: 'moderation',
      memberName: 'kick',
      guildOnly: true,
      userPermissions: [ 'KICK_MEMBERS' ],
      clientPermissions: [ 'KICK_MEMBERS' ]
    });
  };

  run(message, { user, reason }) {
    if (user === this.client.user) {
      return message.say("Nice try, you can't kick me though!");
    }

    if (user.id === message.author.id) {
      return message.say("You don't just kick yourself out from the server...");
    }

    const member = message.guild.member(user);

    if (!member) {
      return message.say('I dunno who that is!');
    }

    return member.kick(reason)
      .then(() => message.say(`Successfully kicked ${user}!`))
      .catch(() => message.say(`:warning: Failed to kick user ${user}.`));
  }
};

module.exports = Kick;
module.exports.meta = meta;
