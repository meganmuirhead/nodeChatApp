const net = require('net');
node server.js > client.log 2>&1;



let clientArray = [];
let keepingTrackOfConnectedClients = 0;
let messageThread = [];

const server = net.createServer((client) => {
    keepingTrackOfConnectedClients++;
    //adding new client to client array
    clientNumber = clientArray.push(client);
    // name for client
    client.name = client.remotePort + ": ";

    //welcoming my new guest
    client.setEncoding('utf8');
    client.write("Hello " + `Guest${keepingTrackOfConnectedClients}` + ", you'll be " + client.name + "from " +
        "here on out! :)");

    //broading what guest entered the chat room
    broadcast(`Guest${keepingTrackOfConnectedClients}: ` + `entered the chat room  and will be ` + client.name +
        "from here on out!", client);
    // broadcast(client.name + `entered the chat room `, client);


// come back to if eles about 1 user to many
    broadcast(clientNumber + ' user/s connected');
    //incoming message from client/s
    client.on('data', data => {
        broadcast(client.name, data, client);

    });

    client.on('data', data => {
        clientArray.forEach(user => {
            if(user === client) return;
                user.write(`Guest${client.name}: ${data}`);

        });
    console.log(data);
    });

    //removing user from chatroom
    client.on('end', () => {
        console.log('client disconnected');
        clientArray.splice(clientArray.indexOf(client), 1);
        broadcast(client.name + " left the chatroom");

    });

});
server.on('error', (err) => {
    throw err;
});

function broadcast(message, sender) {
    let messageThreadFromClients = messageThread.push(message);

    clientArray.forEach(client => {
        // Don't want to send it to sender
        if (client === sender) return;
        client.write(message);
        console.log('message printing:'+ message);
    });
    // Log it to the server output too
    process.stdout.write(messageThreadFromClients);
    console.log("hopefully array of messages" + messageThreadFromClients);
}

server.listen(5000, () => {
    console.log('Server connected and listening for users to chat and connect');
});