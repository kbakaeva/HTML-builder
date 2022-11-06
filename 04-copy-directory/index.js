const path = require('path');
const fs = require('fs');
const { readdir, mkdir } = require('fs/promises');

const dir = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

fs.rm(dirCopy, { recursive: true, force: true }, () => {
    mkdir(dirCopy, { recursive: true }).then(() => {
        readdir(dir).then((res) => {
            for (let file of res) {
                let fullName = path.join(dir, file);
                let fullNameCopy = path.join(dirCopy, file);
                fs.createReadStream(fullName).pipe(fs.createWriteStream(fullNameCopy));
            }
        });
    });
});

