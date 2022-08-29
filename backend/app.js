const fs = require("fs");
const qrcode = require("qrcode-terminal");
var bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const { generateImage } = require("./controllers/handle");

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/web"));
var jsonParser = bodyParser.json();
const sendWithApi = (req, res) => {
  const { message, to } = req.body;
  const newNumber = `91${to}@c.us`;
  console.log(message, to);
  sendMessage(newNumber, message);
  res.send({ status: "success" });
};
app.post("/send", jsonParser, sendWithApi);
const client = new Client({
  authStrategy: new LocalAuth()
});
client.on("qr", qr =>
  generateImage(qr, () => {
    qrcode.generate(qr, { small: true });

    console.log("View QR http://localhost:5000/qr");
  })
);
client.on("authenticated", session => {
  console.log("auth");
});

client.on("ready", () => {
  console.log("Client is ready!");
});
// client.on("message", message => {
//   console.log(message.body);
// });
function listenMessage() {
  client.on("message", msg => {
    const { from, to, body } = msg;
    console.log(from, to, body);
    sendMessage(from, "sads");
  });
}
const sendMessage = (to, message) => {
  client.sendMessage(to, message);
};
const sendMedia = (to, file) => {
  const mediafile = MessageMedia.fromFilePath(`./media/${file}`);
  client.sendMessage(to, mediafile);
};

client.initialize();
app.listen(5000, () => {});
