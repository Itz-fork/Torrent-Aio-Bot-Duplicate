const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");
const { uploadFileStream } = require("../utils/gdrive");

const api = process.env.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);

const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;
//const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;
const downloadRegex = /\/download (.+)/;
const statusRegex = /\/status (.+)/;
const removeRegex = /\/remove (.+)/;

const startMessage = `
Hi Bro 😉️,

<b>I'm Torrent Nexa Bot 😇️,</b>

My Features 👇️,

🔥️ Search Across Torrent Sites ( Currently Disabled 🙁️ )
🔥️ Download Magnet Links and Upload It To My Owner's Team Drive
🔥️ Give a Direct Download To Uploaded Magnet Link.
🔥️ Get Details Of a Torrent
🔥️ Get Status of a Torrent
🔥️ I have a Website To Ease Your Work!
🔥️ I also have a G-drive Index To listup Your Downloaded Files and Get A Sharable Link To It!
`;

const helpMessage = `
   <b>~~ Available Commands 👇️ ~~</b>

/start - Start Me 🙂️
/download - To Download A Torrent 😆️
/remove - To Remove Downloading Torrent 😌️
/details - To Get Detail Of Torrent 🤗️
/status - To Get Status Of Torrent 🧐️
/help - To Get This Help Message! 🤗️

Made With ❤️ By @NexaBotsUpdates
`;

var start_buttons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔰 Updates Channel 🔰", url: "https://t.me/NexaBotsUpdates" }],
          [{ text: "⚜️ Support Group ⚜️", url: "https://t.me/Nexa_bots" }]
        ]
      },
      parse_mode : "HTML"
    };

function bot(torrent, bot) {
  bot.onText(/\/start/, async msg => {
    bot.sendMessage(msg.chat.id, startMessage, start_buttons);
  }),
  bot.onText(/\/help/, async msg => {
    bot.sendMessage(msg.chat.id, helpMessage, {parse_mode : "HTML"});
  });

  bot.on("message", async msg => {
    if (!msg.document) return;
    const chatId = msg.chat.id;
    const fileSize = msg.document.file_size;
    const mimeType = msg.document.mimeType;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;
//     if (size > 20000000) {
//       bot.sendMessage(chatId, `Ooops, File size is too big!`) return;
//     }
    try {
      if (fileSize > 20000000) {
       bot.sendMessage(chatId, `Ooops, File size is too big!`);
      } else if {
      bot.sendMessage(chatId, "📤 Uploading Your File to Google Drive...", {parse_mode : "HTML"});
      const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
      const driveId = uploadedFile.data.id;
      const driveLink = `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
      const publicLink = `${process.env.SITE}api/v1/drive/file/${fileName}?id=${driveId}`;
      bot.editMessageText(chatId, `<b>💾 Uploaded to Google Drive</b> \n\n<b>Name 🏷️:</b> <code>${fileName}</code> \n\n<b>Google Drive Link 🔗:</b> ${driveLink} \n<b>Google Drive Link 🔗:</b> ${publicLink} \n\nJoin @NexaBotsUpdates ❤️`, {parse_mode : "HTML"});
      }
    } catch (e) {
      bot.sendMessage(chatId, e.message || "An error occured 🥺");
    }
  });

//   bot.onText(/\/server diskinfo (.+)/, async (msg, match) => {
//     const from = msg.chat.id;
//     const path = match[1];
//     const info = await diskinfo(path);
//     bot.sendMessage(from, info);
//   });

//   bot.onText(/\/server uptime/, async msg => {
//     const from = msg.chat.id;
//     bot.sendMessage(from, humanTime(process.uptime() * 1000));
//   });

  bot.onText(/\/server_status/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "<code>Searching For You Keywords 🔍...</code>", {parse_mode : "HTML"});

    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({ data }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "An error occured on server!");
    } else if (!data.results || data.results.length === 0) {
      bot.sendMessage(from, "No results found.");
    } else if (data.results.length > 0) {
      let results1 = "";
      let results2 = "";
      let results3 = "";

      data.results.forEach((result, i) => {
        if (i <= 2) {
          results1 += `<b>Name 🏷️:</b> <code>${result.name}</code> \n<b>Seeds 💰:</b> <code>${result.seeds}</code> \n<b>Details 📝:</b> <code>${result.details}</code> \n<b>Link 🖇️:</b> <code>${result.link}</code> \n\n`;
        } else if (2 < i && i <= 5) {
          results2 += `<b>Name 🏷️:</b> <code>${result.name}</code> \n<b>Seeds 💰:</b> <code>${result.seeds}</code> \n<b>Details 📝:</b> <code>${result.details}</code> \n<b>Link 🖇️:</b> <code>${result.link}</code> \n\n`;
        } else if (5 < i && i <= 8) {
          results3 += `<b>Name 🏷️:</b> <code>${result.name}</code> \n<b>Seeds 💰:</b> <code>${result.seeds}</code> \n<b>Details 📝:</b> <code>${result.details}</code> \n<b>Link 🖇️:</b> <code>${result.link}</code> \n\n`;
        }
      });

      bot.sendMessage(from, results1, {parse_mode : "HTML"});
      bot.sendMessage(from, results2, {parse_mode : "HTML"});
      bot.sendMessage(from, results3, {parse_mode : "HTML"});
    }
  });

//   bot.onText(detailsRegex, async (msg, match) => {
//     var from = msg.from.id;
//     var site = match[1];
//     var query = match[2];

//     bot.sendMessage(from, "🕰️ Loading... Wait and Join @NexaBotsUpdates🕰️");

//     const data = await axios(`${api}/details/${site}?query=${query}`).then(({ data }) => data);
//     if (!data || data.error) {
//       bot.sendMessage(from, "An error occured 🥺");
//     } else if (data.torrent) {
//       const torrent = data.torrent;
//       let result1 = "";
//       let result2 = "";

//       result1 += `<b>Title 🏷️: ${torrent.title} \n\nInfo: ${torrent.info}`;
//       torrent.details.forEach(item => {
//         result2 += `${item.infoTitle} ${item.infoText} \n\n`;
//       });
//       result2 += "Magnet Link 🧲:";

//       await bot.sendMessage(from, result1);
//       await bot.sendMessage(from, result2);
//       await bot.sendMessage(from, torrent.downloadLink);
//     }
//   });

  bot.onText(downloadRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];
    let messageObj = null;
    let torrInterv = null;

    const reply = async torr => {
      let mess1 = "";
      mess1 += `<b>Name 🏷️:</b> <code>${torr.name}</code>\n\n`;
      mess1 += `<b>Status 📱:</b> <code>${torr.status}</code>\n\n`;
      mess1 += `<b>Size 📏:</b> <code>${torr.total}</code>\n\n`;
      if (!torr.done) {
        mess1 += `<b>Downloaded ✅:</b> <code>${torr.downloaded}</code>\n\n`;
        mess1 += `<b>Speed 🚀:</b> <code>${torr.speed}</code>\n\n`;
        mess1 += `<b>Progress 📥:</b> <code>${torr.progress}%</code>\n\n`;
        mess1 += `<b>Time Remaining ⏳:</b> <code>${torr.redableTimeRemaining}</code>\n\n`;
      } else {
        mess1 += `<b>Download Link 🔗:</b> ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }
      mess1 += `<b>Magnet URI 🧲:</b> <code>${torr.magnetURI}</code>`;
      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id, parse_mode : "HTML" });
        } else messageObj = await bot.sendMessage(from, mess1, {parse_mode : "HTML"});
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `<b>💾 Uploaded to Google Drive</b> \n\n<b>Name 🏷️:</b> <code>${torr.name}</code> \n<b>Google Drive Link 🔗:</b> ${url} \n\nJoin @NexaBotsUpdates ❤️`, {parse_mode : "HTML"});
    const onDriveUploadStart = torr => bot.sendMessage(from, `📤 Uploading <code>${torr.name}</code> to Google Drive...`, {parse_mode : "HTML"});

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Hey! Link is not a magnet link 😒️");
    } else {
      bot.sendMessage(from, "<code>📩️ Starting to download 📩️...</code> \n\nJoin @NexaBotsUpdates ❤️", {parse_mode : "HTML"});
      try {
        const torren = torrent.download(
          link,
          torr => reply(torr),
          torr => reply(torr),
          onDriveUpload,
          onDriveUploadStart
        );
        torrInterv = setInterval(() => reply(torrent.statusLoader(torren)), 5000);
      } catch (e) {
        bot.sendMessage(from, "An error occured 🤷‍♀️️\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Hey! Link is not a magnet link 😒️");
    } else if (!torr) {
      bot.sendMessage(from, "Not downloading please add 😌️");
    } else {
      let mess1 = "";
      mess1 += `<b>Name 🏷️:</b> <code>${torr.name}</code>\n\n`;
      mess1 += `<b>Status 📱:</b> <code>${torr.status}</code>\n\n`;
      mess1 += `<b>Size 📏:</b> <code>${torr.total}</code>\n\n`;
      if (!torr.done) {
        mess1 += `<b>Downloaded ✅:</b> <code>${torr.downloaded}</code>\n\n`;
        mess1 += `<b>Speed 🚀:</b> <code>${torr.speed}</code>\n\n`;
        mess1 += `<b>Progress 📥:</b> <code>${torr.progress}</code>\n\n`;
        mess1 += `<b>Time Remaining ⏳:</b> <code>${torr.redableTimeRemaining}</code>\n\n`;
      } else {
        mess1 += `<b>Download Link 🔗:</b> <code>${torr.downloadLink}</code>\n\n`;
      }
      mess1 += `<b>Magnet URI 🧲:</b> <code>${torr.magnetURI}</code>`;
      bot.sendMessage(from, mess1, {parse_mode : "HTML"});
    }
  });

  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "Removed That Torrent 😏️");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
}

module.exports = bot;
