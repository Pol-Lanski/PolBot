'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say("Hi, I'm the CST bot! Type BOT to get started!")
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

/* getReply should allow for some variety in responses for received text messages that 
do not have an entry in the scripts.json file. */
    function getReply() {
                var messages = [ "Sorry. I'm not configured with a response to your message. Text COMMANDS to see a few examples.",
                                 "Hey, I didn't understand that. I suggest sending ABOUT.",
                                 "Oops, I didn't get it. COMMANDS are generally only one word and are capitalized. You should only write this word.",
                                 "I can't understand. Text me ABOUT to learn about the CSTbot project.",
                                 "I'm not AI-powered and I can only understand certain COMMANDS. Try COMMANDS for more.",
                                 "The program responds to COMMANDS only, but not sentences. If you mix the command in a sentence I will not get it! :)",
                                 "The CSTbot is not a human and can't 'really' understand you. It is just a series of files on a computer. Text ABOUT to learn more.",
                                 "Nope, can't do. I just know very simple COMMANDS, but I can't understand sentences. Type just NEXT, NBU, TEAM or the name of a TEAM member",
                                 "Yo. I do not know what you are talking about. Please don't give me sentences, give me just a COMMAND",
                                 "This is just an example bot. It's got no AI and definitely cannot learn from your inputs. Unless someone is reading... If I were you I'd be careful.",
                                 "That's interesting. Hhhmmm... I never thought of that. Maybe try COMMANDS to see what I can think about.",
                                 "Can you say that again?",
                                 "Yeah, this is embarassing... It happens from time to time. It's really not your fault. Try COMMANDS.",
                                 "That is a ton of words you just wrote there... I really don't know. Try ABOUT",
                                 "The CST team is working to make me understand that. Until then, I don't get it.",
                                 "Try sending a command without punctuation.",
                                 "I'm not programmed to respond to that."
                                ];

                var arrayIndex = Math.floor( Math.random() * messages.length );


                return messages[arrayIndex];
                
            }
//here the added stuff ends

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

/*
                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`I didn't understand that.`).then(() => 'speak');
                }
*/
                 if (!_.has(scriptRules, upperText)) {
                    return bot.say( getReply() ).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
