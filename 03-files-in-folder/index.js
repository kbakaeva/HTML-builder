const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const dir = path.join(__dirname, 'secret-folder');

readdir(dir).then((res) => {
    for (let file of res) {
        let fullName = path.join(dir, file);
        fs.stat(fullName, (err, stats) => {
            if (!stats.isDirectory()) {
                console.log(file.replace(path.extname(file), ''),
                    ' - ',
                    path.extname(file).replace('.', ''),
                    ' - ',
                    stats.size / 1000 + 'kb'
                );
            }
        });
    }
});

