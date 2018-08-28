const net = require('net');


let client = net.createConnection({port:5000}, () => {
    console.log("Client is now connected");
});

client.setEncoding('utf8');
process.stdin.pipe(client);
client.on('data', data => {
    console.log(data)
});

