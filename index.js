const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const Database = require("./database");
const axios  = require("axios");

const app = express();

// Web server for health check
app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Telegram bot token
const botToken = "7235896479:AAHeHufxmxVfmHmCAbShhjQ0kJzOaQRZ2us"; // Replace with your actual token
const bot = new TelegramBot(botToken, { polling: true });

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || "User";

  const welcomeMessage = `
Hello, ${username} 👋

I Am *YummyURL Link Converter*\\. I Can Convert Links Directly From Your yummyurl\\.com Account\\.

🚀 **To Get Started**:
1\\. Go To 👉 [https://yummyurl\\.com/member/tools/api](https://yummyurl.com/member/tools/api)\\

2\\. Then Copy Your API Key\\.

3\\. Then Type **/api**, give a single space, and paste your API Key\\.  
   \\(See example below to understand more\\)

**Example**: \`/api f4e1781dfebf0f6\`

💁‍♀️ Hit 👉 **/help** To Get Help\\.

➕ Hit 👉 **/footer** To Get Help About Adding Your Custom Footer To Bot\\. 

➕ Hit 👉 **/header** To Get Help About Adding Your Custom Header To Bot\\.

Happy linking🎉
`;

  bot
    .sendMessage(chatId, welcomeMessage, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Visit YummyURL",
              url: "https://yummyurl.com",
            },
          ],
        ],
      },
    })
    .catch((err) => console.error("Error sending /start message:", err));
});

// /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
Hey My name is *YummyURL Link Converter Bot* and I'm a link converter and shortener bot \\.

*Features:*
• Hyperlink support 🔗
• Button conversion support 🔘
• Domain inclusion and exclusion options 🌐
• Header and footer text support 📝
• Replace username function 📎
• Banner image support 🖼

*Useful Commands:*
• /start — Start me up\\. You probably already used this\\.
• /help — Sends this message\\. I’ll tell you more about myself\\.

*Available Commands:*
• /api — Use this command to For API key  \\.
• /header — Command For  header text\\.
• /footer — Command For footer text\\.
• /username — For username\\.
• /me — See your settings details\\.

⚠️Note : IF Header Footer Status is Disabled Then Header Not Show No Matter It Set Or Not

If you have any problem, click the button below to contact us\\.
  `;

  bot.sendMessage(chatId, helpMessage, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Contact Us",
              url: "https://t.me/yummyurl_admin",
            },
          ],
        ],
      },
    })
    .catch((err) => console.error("Error sending /help message:", err));
});

bot.onText(/\/header(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const headerText = match[1]?.trim(); // Extract header text
  
    try {
      // Check if user data exists
      const currentHeader = Database.getUserData(chatId, "header");
  
      if (!headerText) {
        // If no text is provided
        bot.sendMessage(
          chatId,
          `ᴛᴏ ꜱᴇᴛ ᴛʜᴇ ʜᴇᴀᴅᴇʀ ᴛᴇxᴛ ꜰᴏʀ ᴇᴠᴇʀʏ ᴍᴇꜱꜱᴀɢᴇ ᴄᴀᴘᴛɪᴏɴ ᴏʀ ᴛᴇxᴛ, ᴊᴜꜱᴛ ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ᴛᴇxᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴜꜱᴇ\. ʏᴏᴜ ᴄᴀɴ ᴜꜱᴇ ᴛᴏ ᴀᴅᴅ ᴀ ʟɪɴᴇ ʙʀᴇᴀᴋ\.\n\n` +
            `🗑 ᴛᴏ ADD ᴛʜᴇ ʜᴇᴀᴅᴇʀ ᴛᴇxᴛ, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ᴄᴏᴍᴍᴀɴᴅ:\n/header HEADER_TEXT\n\n` +
            `🗑 ᴛᴏ ʀᴇᴍᴏᴠᴇ ᴛʜᴇ ʜᴇᴀᴅᴇʀ ᴛᴇxᴛ, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ᴄᴏᴍᴍᴀɴᴅ:\n/header ʀᴇᴍᴏᴠᴇ\n\n` +
            `⚠️ HEADER Status Must be Enabled for more click \me \n\n` +

            `ᴛʜɪꜱ ɪꜱ ᴀ ʜᴇʟᴘꜰᴜʟ ᴡᴀʏ ᴛᴏ ᴀᴅᴅ ᴀ ᴄᴏɴꜱɪꜱᴛᴇɴᴛ ʜᴇᴀᴅᴇʀ ᴛᴏ ᴀʟʟ ᴏꜰ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇꜱ. ᴇɴᴊᴏʏ🎉\n\n` +
            `📜 CURRENT HEADER: ${currentHeader || "None"}`
        );
      } else if (headerText.toLowerCase() === "remove") {
        // Remove header
        if (currentHeader) {
          Database.removeUserData(chatId, "header");
          bot.sendMessage(chatId, "✅ Header text has been removed.");
        } else {
          bot.sendMessage(chatId, "⚠️ No header text found to remove.");
        }
      } else {
        // Update or add header
        if (currentHeader) {
          Database.updateUserData(chatId, "header", headerText);
          bot.sendMessage(chatId, `✅ Header text has been updated:\n\n${headerText}`);
        } else {
          Database.saveUserData(chatId, "header", headerText);
          bot.sendMessage(chatId, `✅ Header text has been added:\n\n${headerText}`);
        }
      }
    } catch (error) {
      console.error("Error handling /header command:", error);
      bot.sendMessage(chatId, "⚠️ An error occurred while processing your request.");
    }
  });
  
// /footer command
bot.onText(/\/footer(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const footerText = match[1]?.trim(); // Extract footer text
  
    try {
      // Check if user data exists for footer
      const currentFooter = Database.getUserData(chatId, "footer");
  
      if (!footerText) {
        // If no text is provided
        bot.sendMessage(
          chatId,
          `ᴛᴏ ꜱᴇᴛ ᴛʜᴇ ꜰᴏᴏᴛᴇʀ ᴛᴇxᴛ ꜰᴏʀ ᴇᴠᴇʀʏ ᴍᴇꜱꜱᴀɢᴇ ᴄᴀᴘᴛɪᴏɴ ᴏʀ ᴛᴇxᴛ, ᴊᴜꜱᴛ ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ᴛᴇxᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴜꜱᴇ. ʏᴏᴜ ᴄᴀɴ ᴜꜱᴇ ᴛᴏ ᴀᴅᴅ ᴀ ʟɪɴᴇ ʙʀᴇᴀᴋ\.\n\n` +
            `🗑 ᴛᴏ ADD ᴛʜᴇ ꜰᴏᴏᴛᴇʀ ᴛᴇxᴛ, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ᴄᴏᴍᴍᴀɴᴅ:\n/footer FOOTER_TEXT\n\n` +
            `🗑 ᴛᴏ ʀᴇᴍᴏᴠᴇ ᴛʜᴇ ꜰᴏᴏᴛᴇʀ ᴛᴇxᴛ, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ᴄᴏᴍᴍᴀɴᴅ:\n/footer ʀᴇᴍᴏᴠᴇ\n\n` +
            `⚠️ FOOTER Status Must be Enabled for more click \me \n\n` +
            `ᴛʜɪꜱ ɪꜱ ᴀ ʜᴇʟᴘꜰᴜʟ ᴡᴀʏ ᴛᴏ ᴀᴅᴅ ᴀ ᴄᴏɴꜱɪꜱᴛᴇɴᴛ ꜰᴏᴏᴛᴇʀ ᴛᴏ ᴀʟʟ ᴏꜰ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇꜱ. ᴇɴᴊᴏʏ🎉\n\n` +
            `📜 CURRENT FOOTER: ${currentFooter || "None"}`
        );
      } else if (footerText.toLowerCase() === "remove") {
        // Remove footer
        if (currentFooter) {
          Database.removeUserData(chatId, "footer");
          bot.sendMessage(chatId, "✅ Footer text has been removed.");
        } else {
          bot.sendMessage(chatId, "⚠️ No footer text found to remove.");
        }
      } else {
        // Update or add footer
        if (currentFooter) {
          Database.updateUserData(chatId, "footer", footerText);
          bot.sendMessage(chatId, `✅ Footer text has been updated:\n\n${footerText}`);
        } else {
          Database.saveUserData(chatId, "footer", footerText);
          bot.sendMessage(chatId, `✅ Footer text has been added:\n\n${footerText}`);
        }
      }
    } catch (error) {
      console.error("Error handling /footer command:", error);
      bot.sendMessage(chatId, "⚠️ An error occurred while processing your request.");
    }
  });
  
  bot.onText(/\/username(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const usernameInput = match[1]?.trim(); // Extract username input
  
    try {
      // Check if user data exists for username
      const currentUsername = Database.getUserData(chatId, "username");
  
      if (!usernameInput) {
        // If no username is provided
        bot.sendMessage(
          chatId,
          `ᴛᴏ ꜱᴇᴛ ᴛʜᴇ ᴜꜱᴇʀɴᴀᴍᴇ ᴛʜᴀᴛ ᴡɪʟʟ ʙᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ʀᴇᴘʟᴀᴄᴇᴅ ᴡɪᴛʜ ᴏᴛʜᴇʀ ᴜꜱᴇʀɴᴀᴍᴇꜱ ɪɴ ᴛʜᴇ ᴘᴏꜱᴛ, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ᴄᴏᴍᴍᴀɴᴅ:\n\n` +
            `/username ʏᴏᴜʀ_ᴜꜱᴇʀɴᴀᴍᴇ\n\n` +
            `(ɴᴏᴛᴇ: ᴅᴏ ɴᴏᴛ ɪɴᴄʟᴜᴅᴇ ᴛʜᴇ @ ꜱʏᴍʙᴏʟ ɪɴ ʏᴏᴜʀ \ᴜꜱᴇʀɴᴀᴍᴇ.)\n\n` +
            `ᴛᴏ ʀᴇᴍᴏᴠᴇ ᴛʜᴇ ᴄᴜʀʀᴇɴᴛ ᴜꜱᴇʀɴᴀᴍᴇ, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ᴄᴏᴍᴍᴀɴᴅ:\n\n` +
            `/username ʀᴇᴍᴏᴠᴇ\n\n` +
            `📜 CURRENT USERNAME: ${currentUsername || "None"}`
        );
      } else if (usernameInput.toLowerCase() === "remove") {
        // Remove username
        if (currentUsername) {
          Database.removeUserData(chatId, "username");
          bot.sendMessage(chatId, "✅ Username has been removed.");
        } else {
          bot.sendMessage(chatId, "⚠️ No username found to remove.");
        }
      } else {
        // Add or update username
        if (/[^a-zA-Z0-9_]/.test(usernameInput)) {
          bot.sendMessage(
            chatId,
            "❌ Invalid username. Please use only letters, numbers, and underscores, without the @ symbol."
          );
        } else {
          if (currentUsername) {
            Database.updateUserData(chatId, "username", usernameInput);
            bot.sendMessage(
              chatId,
              `✅ Username has been updated:\n\n${usernameInput}`
            );
          } else {
            Database.saveUserData(chatId, "username", usernameInput);
            bot.sendMessage(
              chatId,
              `✅ Username has been set:\n\n${usernameInput}`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error handling /username command:", error);
      bot.sendMessage(chatId, "⚠️ An error occurred while processing your request.");
    }
  });
  

  bot.onText(/\/me/, async (msg) => {
    const chatId = msg.chat.id;
  
    // Fetch user-specific settings
    const website = "YummyURL";
    const api = Database.getUserData(chatId, "api") || "None";
    const username = Database.getUserData(chatId, "username") || "None";
    const headerText = Database.getUserData(chatId, "header") || "None";
    const footerText = Database.getUserData(chatId, "footer") || "None";
  
    // Fetch header and footer status (default to enabled if not set)
    let headerStatus = Database.getUserData(chatId, "header_status");
    let footerStatus = Database.getUserData(chatId, "footer_status");
  
    if (headerStatus === undefined) {
      headerStatus = 1; // Default to enabled
      Database.saveUserData(chatId, "header_status", headerStatus);
    }
    if (footerStatus === undefined) {
      footerStatus = 1; // Default to enabled
      Database.saveUserData(chatId, "footer_status", footerStatus);
    }
  
    const isHeaderEnabled = headerStatus === 1;
    const isFooterEnabled = footerStatus === 1;
  
    // Prepare the response message
    const response = `
  🔧 **ʜᴇʀᴇ ᴀʀᴇ ᴛʜᴇ ᴄᴜʀʀᴇɴᴛ ꜱᴇᴛᴛɪɴɢꜱ ꜰᴏʀ ᴛʜɪꜱ ʙᴏᴛ**:
  
  - 🌐 **ᴡᴇʙꜱɪᴛᴇ**: ${website}
  
  - 🔌 **ᴀᴘɪ**: ${api}
  
  - 📎 **ᴜꜱᴇʀɴᴀᴍᴇ**: @${username}
  
  - 📝 **ʜᴇᴀᴅᴇʀ ᴛᴇxᴛ**:
  ${headerText}
  
  - 📝 **ꜰᴏᴏᴛᴇʀ ᴛᴇxᴛ**:
  ${footerText}
  `;
  
    // Inline keyboard
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: `Header: ${isHeaderEnabled ? "E" : "D"}`, callback_data: "header_static" },
          { text: isHeaderEnabled ? "❌ Disable" : "✅ Enable", callback_data: "toggle_header" },
        ],
        [
          { text: `Footer: ${isFooterEnabled ? "E" : "D"}`, callback_data: "footer_static" },
          { text: isFooterEnabled ? "❌ Disable" : "✅ Enable", callback_data: "toggle_footer" },
        ],
      ],
    };
  
    // Send the message with inline keyboard
    bot.sendMessage(chatId, response, {
      parse_mode: "Markdown",
      reply_markup: inlineKeyboard,
    });
  });
  
  // Handle inline button callbacks
  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
  
    let responseText = "";
    if (data === "toggle_header") {
      // Fetch and toggle header status
      let headerStatus = Database.getUserData(chatId, "header_status");
      if (headerStatus === undefined) {
        headerStatus = 1; // Default to enabled if not present
      }
      const newHeaderStatus = headerStatus === 1 ? 0 : 1;
      Database.saveUserData(chatId, "header_status", newHeaderStatus);
      responseText = newHeaderStatus === 1 ? "✅ Header is now enabled." : "❌ Header is now disabled.";
    } else if (data === "toggle_footer") {
      // Fetch and toggle footer status
      let footerStatus = Database.getUserData(chatId, "footer_status");
      if (footerStatus === undefined) {
        footerStatus = 1; // Default to enabled if not present
      }
      const newFooterStatus = footerStatus === 1 ? 0 : 1;
      Database.saveUserData(chatId, "footer_status", newFooterStatus);
      responseText = newFooterStatus === 1 ? "✅ Footer is now enabled." : "❌ Footer is now disabled.";
    } else if (data === "header_static" || data === "footer_static") {
      // Prevent clicks on static buttons
      bot.answerCallbackQuery(callbackQuery.id, { text: "This button is not clickable." });
      return;
    }
  
    // Update the user with an alert and refresh `/me` to show updated status
    bot.answerCallbackQuery(callbackQuery.id, { text: responseText });
    bot.sendMessage(chatId, "✅ The Status Is CHANGED To View Updated Status Clicked /me"); // Refresh the `/me` command
  });
  

  bot.onText(/\/api(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const apiText = match[1]?.trim(); // Extract API text
  
    try {
      // Check if user data exists
      const currentApi = Database.getUserData(chatId, "api");
  
      if (!apiText) {
        // If no text is provided
        if (currentApi) {
          bot.sendMessage(
            chatId,
            `🔧 ᴛᴏ ꜱᴇᴛ ᴏʀ ᴜᴘᴅᴀᴛᴇ ᴛʜᴇ API, ᴜꜱᴇ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ ꜰᴏʀᴍᴀᴛ:\n` +
              `/api API_KEY\n\n` +
              `🗑 ᴛᴏ ʀᴇᴍᴏᴠᴇ ᴛʜᴇ API, ᴜꜱᴇ:\n` +
              `/api remove\n\n` +
              `🌟 CURRENT API KEY: 🗝️ \`${currentApi}\``
          );
        } else {
          bot.sendMessage(
            chatId,
            `ᴛᴏ ᴀᴅᴅ ᴏʀ ᴜᴘᴅᴀᴛᴇ ʏᴏᴜʀ ꜱʜᴏʀᴛɴᴇʀ ᴡᴇʙꜱɪᴛᴇ ᴀᴘɪ.\n\n` 
            
            `Ex: /api a11b67871d303d2e0f76ab0:\n\n` 
            
            `ɢᴇᴛ ᴀᴘɪ ꜰʀᴏᴍ Yummyurl.com \n\n<br>
            
            ᴄᴜʀʀᴇɴᴛ yummyurl.com ᴀᴘɪ: None`
          );
        }
      } else if (apiText.toLowerCase() === "remove") {
        // Remove API
        if (currentApi) {
          Database.removeUserData(chatId, "api");
          bot.sendMessage(chatId, "✅ API key has been removed.");
        } else {
          bot.sendMessage(chatId, "⚠️ No API key found to remove.");
        }
      } else {
        // Update or add API
        if (currentApi) {
          Database.updateUserData(chatId, "api", apiText);
          bot.sendMessage(chatId, `✅ API key has been updated to:\n🗝️ \`${apiText}\``);
        } else {
          Database.saveUserData(chatId, "api", apiText);
          bot.sendMessage(chatId, `✅ API key has been added:\n🗝️ \`${apiText}\``);
        }
      }
    } catch (error) {
      console.error("Error handling /api command:", error);
      bot.sendMessage(chatId, "⚠️ An error occurred while processing your request.");
    }
  });




// url shorten code


// Helper: Fetch user settings for header/footer
function getUserSettings(chatId) {
  const dbData = Database.getDatabaseData();
  return dbData[chatId] || {};
}

function getUserToken(chatId) {
  return Database.getUserData(chatId, "api");
}

// Process messages (text and images with captions)
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text || msg.caption; // Handle text or caption from images

  // Ignore non-text messages without captions
  if (!messageText) {
    return;
  }

  // Ignore commands
  if (messageText.startsWith("/")) {
    return;
  }

  // Extract URLs from the text or caption
  const urls = extractUrls(messageText);
  if (urls.length === 0) {
    bot.sendMessage(chatId, "⚠ No URLs detected in the message.");
    return;
  }

  // Check if API token is set
  const userToken = getUserToken(chatId);
  if (!userToken) {
    bot.sendMessage(
      chatId,
      "⚠ Please set your API token first using `/api YOUR_YUMMYURL_API_TOKEN`."
    );
    return;
  }

  // Fetch user's header/footer settings
  const userSettings = getUserSettings(chatId);
  const header = userSettings.header || "";
  const footer = userSettings.footer || "";
  const headerStatus = userSettings.header_status ?? 1; // Default: enabled
  const footerStatus = userSettings.footer_status ?? 1; // Default: enabled

  try {
    let updatedText = messageText;

    // Shorten each URL
    for (const url of urls) {
      const apiUrl = `https://yummyurl.com/api?api=${userToken}&url=${encodeURIComponent(
        url
      )}`;
      const response = await axios.get(apiUrl);
      const shortUrl = response.data.shortenedUrl || url;

      // Replace the URL in the text while keeping the rest intact
      const regex = new RegExp(url, "g"); // Replace all occurrences
      updatedText = updatedText.replace(regex, shortUrl);
    }

    // Attach header and footer if enabled
    if (headerStatus === 1 && header.trim()) {
      updatedText = `${header.trim()}\n${updatedText}`;
    }
    if (footerStatus === 1 && footer.trim()) {
      updatedText = `${updatedText}\n${footer.trim()}`;
    }

    // Send the final message
    if (msg.photo) {
      // If the message contains a photo, send the photo with the updated caption
      const photo = msg.photo[msg.photo.length - 1].file_id; // Get the highest resolution photo
      bot.sendPhoto(chatId, photo, { caption: updatedText });
    } else {
      // Otherwise, send a regular text message
      bot.sendMessage(chatId, updatedText);
    }
  } catch (error) {
    console.error("Error processing URLs:", error.message);
    bot.sendMessage(
      chatId,
      "⚠ An error occurred while shortening the URLs. Please try again."
    );
  }
});

// Utility: Extract URLs from text
function extractUrls(text) {
  if (!text) {
    return [];
  }
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.match(urlPattern) || [];
}
