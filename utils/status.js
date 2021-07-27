const diskinfo = require("./diskinfo");
const humanTime = require("../utils/humanTime");
const prettyBytes = require("./prettyBytes");

async function status(path = "/app") {
  let info = "";

  try {
    let dinfo = await diskinfo(path);
    const memory = process.memoryUsage();

    if (typeof dinfo === "string") throw Error(dinfo);

    info += `<b>✯ Disk,</b> \n`;
    info += `   <b>Total:</b> <code>${dinfo.total}</code> \n`;
    //info += `   <b>Available:</b> ${dinfo.available} \n`;
    info += `   <b>Used:</b> <code>${prettyBytes(dinfo.totalInBytes - dinfo.freeInBytes)}</code> \n`;
    info += `   <b>Free:</b> <code>${dinfo.free}</code> \n\n`;
    info += `<b>✯ Memory,</b> \n`;
    info += `   <b>Total:</b> <code>${prettyBytes(memory.external)}</code> \n`;
    info += `   <b>Rss:</b> <code>${prettyBytes(memory.rss)}</code> \n\n`;
    info += `<b>✯ Heap,</b> \n`;
    info += `   <b>Total:</b> <code>${prettyBytes(memory.heapTotal)}</code> \n`;
    info += `   <b>Used:</b> <code>${prettyBytes(memory.heapUsed)}</code> \n\n`;
    info += `<b>✯ Uptime:</b> <code>${humanTime(process.uptime() * 1000)}</code> \n`;

    return info;
  } catch (e) {
    console.log(e);
    info = e.message;
    return info;
  }
}

module.exports = status;
