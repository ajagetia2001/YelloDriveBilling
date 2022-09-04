const fs = require("fs");
const qrcode = require("qrcode-terminal");
var bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const { generateImage } = require("./controllers/handle");
const { createInvoice } = require("./createInvoice.js");

let invoice = {
  shipping: {
    name: "Aman Kalra",
    address: "1234 Main Street",
    city: "Noida",
    state: "NCR",
    country: "India",
    postal_code: 94111
  },
  items: [],
  subtotal: 0,
  paid: 0,
  invoice_nr: 1234
};

// createInvoice(invoice, "invoice.pdf");

const app = express();
app.use(cors());
var qr1;
var check = false;
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/web"));
var jsonParser = bodyParser.json();
const sendWithApi = (req, res) => {
  const { message, to, data } = req.body;
  // invoice.items = data.item;
  // invoice.subtotal = data.totalPrice;
  // console.log(invoice);
  // createInvoice(invoice, "invoice.pdf");
  // createInvoice(invoice, "invoice.pdf");

  const newNumber = `91${to}@c.us`;
  console.log(message, to, data);
  // sendMessage(newNumber, message);
  sendMedia(newNumber, "invoice.pdf");
  sendMessage(newNumber, message);
  sendMedia(newNumber, "invoice.pdf");

  res.send({ status: "success" });
};
const createInvoiceApi = (req, res) => {
  const { message, to, data } = req.body;
  invoice.items = data.item;
  invoice.subtotal = data.totalPrice;
  console.log(invoice);
  createInvoice(invoice, "invoice.pdf");
  res.send({ status: "success" });
};
app.post("/send", jsonParser, sendWithApi);
app.post("/create", jsonParser, createInvoiceApi);
const client = new Client({
  authStrategy: new LocalAuth()
});
// client.on("qr", qr =>
//   generateImage(qr, () => {
//     qrcode.generate(qr, { small: true });

//     console.log("View QR http://localhost:5000/qr");
//   })
// );

client.on("qr", qr => {
  console.log("kk");
  check = false;
  console.log("QR RECEIVED", qr);

  qr1 = qr;
});
app.get("/qr1", (req, res) => {
  console.log("ss");
  console.log(qr1);
  res.json({ qr1: qr1, check: check });
});
client.on("authenticated", session => {
  check = true;
  console.log("auth");
});

client.on("ready", () => {
  check = true;
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
  console.log("Mei nhi chl rha");
  client.sendMessage(to, message);
};
const sendMedia = (to, file) => {
  console.log("Mei chl rha ");
  const mediafile = MessageMedia.fromFilePath(`${file}`);
  client.sendMessage(to, mediafile);
};

client.initialize();
app.listen(5000, () => {});
