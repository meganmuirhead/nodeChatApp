const net = require('net');
const fs = require('fs');


let clientArray = [];
let keepingTrackOfConnectedClients = 0;
let messageThread = [];

const server = net.createServer((client) => {
    keepingTrackOfConnectedClients++;
    client.setEncoding('utf8');

    //adding new client to client array
    clientNumber = clientArray.push(client);
    // name for client
    client.name = client.remotePort + ": ";

    //welcoming my new guest
    client.setEncoding('utf8');
    client.write("Hello " + `Guest${keepingTrackOfConnectedClients}` + ", you'll be " + client.name + "from " +
        "here on out! :)\n");
    // adding to chat log
    fs.appendFile('./chatLog.txt', `Server: Welcome to the chat room\n`, function () {
        // if (err) throw err;
        console.log("Welcomed to the chatlog saved!");
    });


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
    clientArray.forEach(client => {
        if(clientArray.length === 1) {
            messageThread.push(client.name + 'has joined. \n');
            console.log('message thread ' + messageThread);
            fs.appendFile('./chatLog.txt', + client.name + ': has joined the chat room.', function () {
                // if (err) throw err;
                console.log("console logging that " + client.name + "joined chat room");

            });
        }
        // else if (user !== client) {
        else {

            client.write(client.name + ' has joined the chatroom\n');
            console.log(messageThread);
            fs.appendFile('.chatLog.txt', `${client.name}: has joined the chat room`, function () {

                // if (err) throw err;
            });
        }
    });
    client.on('data', data => {
        clientArray.forEach(user => {
            if(user !== client) {
                user.write(`Guest${client.name}: ${data}`);
                messageThread.push(client.name + data);
                console.log(messageThread);
                fs.appeadFile(`'./chatLog.txt ' + ${client.name}`, data, function () {
                    if (err) throw err;
                });
            } else {
                fs.appendFile(`'./chatLog.txt ' ${client.name}`, data, function () {
                    // if (err) throw err;
                    console.log('your face');
                });
            }
        });
    console.log(data);
    });
    messageThread.push(client.name)
    //removing user from chatroom
    client.on('end', () => {
        console.log('client disconnected');
        clientArray.splice(clientArray.indexOf(client), 1);
        broadcast(client.name + " left the chatroom");
        messageThread.push(client.name + 'has left the chatroom');
        fs.appendFile(`'./chatLog.txt' + ${client.name} + 'has left the chat room\n'`, data, function () {
            console.log('console logging client left chat room');
        })
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