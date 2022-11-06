const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const dir = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const fileStream = fs.createWriteStream(bundleFile, { encoding: 'utf8' });

readdir(dir).then((res) => {

    for (let file of res) {
        if (path.extname(file) != '.css') continue;
        fs.stat(path.join(dir, file), (err, stats) => {
            if (!stats.isDirectory()) {
                fs.createReadStream(path.join(dir, file))
                    .on('data', () => fileStream.write('\n/* ------' + file + ' ------ */\n'))
                    .pipe(fileStream);
            }
        });
    }
});