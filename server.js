const net = require('net');
const fs = require('fs');


let clientArray = [];
let keepingTrackOfConnectedClients = 0;
let messageThread = [];

const server = net.createServer((client) => {
    keepingTrackOfConnectedClients++;
    client.setEncoding('utf8');

    //adding new client to client array
    let clientNumber = clientArray.push(client);
    // name for client
    client.name = client.remotePort;

    //welcoming my new guest
    client.setEncoding('utf8');
    client.write(`Hello Guest${keepingTrackOfConnectedClients} you'll be MysteryGuest${client.name} from here on out! :)\n`);
    // adding to chat log
    fs.appendFile('./chatLog.txt', `Server: Welcome to the chat room\n`, function (err) {
        if (err) throw err;
        // console.log("Console logging the welcome to the chat log got saved!");
    });


    //broading what guest entered the chat room
    broadcast(`Guest${keepingTrackOfConnectedClients}: entered the chat room  and will be MysteryGuest${client.name} from here on out!\n`, client);

// come back to if eles about 1 user to many
    broadcast(clientNumber + ' user/s connected');
    //incoming message from client/s
    // client.on('data', data => {
    //     broadcast(client.name, client);
    // });
    clientArray.forEach(client => {
        if(clientArray.length === 1) {
            messageThread.push(client.name + 'has joined. \n');
            fs.appendFile('./chatLog.txt', + `MysteryGuest${client.name}: has joined the chat room. \n`, function (err) {
                if (err) throw err;
                // console.log("console logging that guest" + client.name + " joined chat room");

            });
        }
        // else if (user !== client) {
        else {

            client.write(`MysteryGuest${client.name} has joined the chat room.\n`);
            fs.appendFile('./chatLog.txt', `MysteryGuest${client.name}: has joined the chat room\n`, function (err) {
                // console.log(messageThread);

                if (err) throw err;
            });
        }
    });
    client.on('data', data => {
        clientArray.forEach(user => {
            if(user !== client) {
                //what the other person see's
                user.write(`MysteryGuest${client.name}: ${data}\n`);
                messageThread.push(client.name + data);
                // console.log(messageThread);
                fs.appendFile('./chatLog.txt', `MysteryGuest${client.name}: added ${messageThread} to thread\n `, function (err) {
                    if (err) throw err;

                    // console.log(`console logging that the guest${client.name}: message got added to the thread\n`);
                });
            }
            // else {
            //     fs.appendFile('./chatLog.txt', `Guest${client.name} message got added to the chat log`, function () {
            //         console.log(`Guest${client.name} message get added thread\n`);
            //     });
            // }
        });
    console.log(data);
    });
    messageThread.push(client.name);
    //removing user from chatroom
    client.on('end', () => {
        // console.log('client disconnected');
        clientArray.splice(clientArray.indexOf(client), 1);
        broadcast(`Guest${client.name} left the chatroom\n`);
        messageThread.push(`Guest${client.name} has left the chatroom\n`);
        fs.appendFile('./chatLog.txt', `Guest${client.name} has left the chat room\n`, function () {
            // console.log('console logging client left chat room');
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
        client.write( message);
        // console.log('console log message printing:'+ message);
    });
    // Log it to the server output too
    // process.stdout.write(messageThreadFromClients);
    process.stdout.write(messageThreadFromClients);

}

server.listen(5000, () => {
    console.log('Server connected and listening for users to chat and connect');
});