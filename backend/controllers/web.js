const fs = require("fs");
const getQr = (req, res) => {
  res.writeHead(200, { "content-type": "image/svg+xml" });
  fs.createReadStream("../sendMedia/qr-code.svg").pipe(res);
};

module.exports = { getQr };
