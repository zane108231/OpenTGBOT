const axios = require('axios');

module.exports = (bot) => {
    bot.onText(/\/nglspam (\S+) (.+) (\d+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const username = match[1]; // Extract the username
        const message = match[2]; // Extract the message
        const amount = parseInt(match[3]); // Extract the amount

        // Construct the API URL
        const apiUrl = `https://nash-rest-api.replit.app/ngl?username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}&deviceId=myDevice&amount=${amount}`;

        // Notify the user that the request is being processed
        bot.sendMessage(chatId, `Sending ${amount} messages to NGL username ${username}...`);

        // Make the API request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bot.sendMessage(chatId, `Successfully sent ${amount} messages to ${username}.`);
                } else {
                    bot.sendMessage(chatId, `Failed to send messages. Error: ${data.error}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                bot.sendMessage(chatId, `An error occurred: ${error.message}`);
            });
    });
};
