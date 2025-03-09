var udp = require("node:dgram");
var client = udp.createSocket("udp4");

const COMMAND_NUM = 1109; // example 23 corresponds to rover state (see TSS readme for more info)
const URL = "data.cs.purdue.edu"; // url that TSS server is running on - NOTE: change to your local server IP
const PORT = 14141; // specified port number that TSS is running on

// Define the message components for the buffer
const timestamp = Buffer.alloc(4);
const commandNumber = Buffer.alloc(4);
const throttle = Buffer.alloc(4);

// Set values (big-endian format)
timestamp.writeUInt32BE(Math.floor(Date.now() / 1000), 0); // Current Unix timestamp
commandNumber.writeUInt32BE(COMMAND_NUM, 0);
throttle.writeFloatBE(100.0, 0);

// Concat all parts into a single message
const message = Buffer.concat([timestamp, commandNumber, throttle]);

// Send the message
client.send(message, PORT, URL, (error) => {
  if (error) {
    console.error(`Error: ${error}`);
    client.close();
  } else {
    console.log(`Command ${COMMAND_NUM} sent!`);
  }
});

client.on("message", function (msg, info) {
  console.log("Data received from server:", msg);
  console.log("Recieved " + msg.length + " bytes from server.");

  // Ensure message has at least the expected header size
  if (msg.length < 8) {
    console.error("Received message is too short!");
    return;
  }

  // Read timestamp (uint32)
  const timestamp = msg.readUInt32BE(0);

  // Read command number (uint32)
  const commandNumber = msg.readUInt32BE(4);

  // Determine the number of floats in the output data
  const outputDataSize = (msg.length - 8) / 4; // Each float is 4 bytes
  const outputData = [];

  for (let i = 0; i < outputDataSize; i++) {
    outputData.push(msg.readFloatBE(8 + i * 4));
  }

  // Display parsed values
  console.log("Parsed Response:");
  console.log("Timestamp:", timestamp);
  console.log("Command Number:", commandNumber);
  console.log("Output Data:", outputData);
});
