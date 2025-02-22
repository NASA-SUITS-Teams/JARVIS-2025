var udp = require("node:dgram");
var client = udp.createSocket("udp4");

const COMMAND_NUM = 23; // example 23 corresponds to rover state (see TSS readme for more info)
const URL = "data.cs.purdue.edu"; // url that TSS server is running on - NOTE: change to your local server IP
const PORT = 14141; // specified port number that TSS is running on

// Define the message components for the buffer
const timestamp = Buffer.alloc(4);
const commandNumber = Buffer.alloc(4);

// Set values (big-endian format)
timestamp.writeUInt32BE(Math.floor(Date.now() / 1000), 0); // Current Unix timestamp
commandNumber.writeUInt32BE(COMMAND_NUM, 0);

// Concat all parts into a single message
const message = Buffer.concat([timestamp, commandNumber]);

// Send the message
client.send(message, PORT, URL, (error) => {
  if (error) {
    console.error(`Error: ${error}`);
    client.close();
  } else {
    console.log(`Command ${COMMAND_NUM} sent!`);
  }
});