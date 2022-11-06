const path = require('path');
const fs = require('fs');
const { stdin } = process;

let fileName = path.join(__dirname, 'text.txt');
let fileStream = fs.createWriteStream(fileName, { encoding: 'utf8' });

console.log('Enter your text:');
stdin.on('data', data => {
    if (data.toString().trim().toUpperCase() == 'EXIT') {
        exit();
    } else {
        fileStream.write(data);
    }
});

process.on('SIGINT', () => {
    exit();
});

function exit() {
    fileStream.end();
    stdin.end('\nThanks and have a nice day !!!\n');
    process.exit(0);
}