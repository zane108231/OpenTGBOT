const express = require('express');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = 3000;

let bots = {}; // Object to store multiple bot instances

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, 'html')));

// Middleware to parse JSON body
app.use(express.json());

// Function to load commands for a specific bot instance
const loadCommands = (botInstance) => {
  const commandsPath = path.join(__dirname, 'commands');

  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      console.error('Error reading commands directory:', err);
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.js') {
        const command = require(path.join(commandsPath, file));
        command(botInstance); // Pass the bot instance to each command module
        console.log(`Loaded command: ${path.basename(file, '.js')}`);
      }
    });
  });
};

// Route to handle bot token setup
app.post('/setToken', (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid bot token.' });
  }

  if (!bots[token]) {
    bots[token] = new TelegramBot(token, { polling: true });
    loadCommands(bots[token]); // Load commands for the new bot instance
    console.log('Bot initialized with token:', token);
  } else {
    bots[token].stopPolling();
    bots[token] = new TelegramBot(token, { polling: true });
    loadCommands(bots[token]); // Reload commands for the reconfigured bot instance
    console.log('Bot reconfigured with token:', token);
  }

  return res.status(200).json({ message: 'Bot token set successfully.' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
