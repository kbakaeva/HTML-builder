const path = require('path');
const fs = require('fs');
const { readdir, mkdir } = require('fs/promises');

const stylesDir = path.join(__dirname, 'styles');
const targetDir = path.join(__dirname, 'project-dist');
const compDir = path.join(__dirname, 'components');

fs.rm(targetDir, { recursive: true, force: true }, () => {
    mkdir(targetDir, { recursive: true }).then(() => {

        copyContent(path.join(__dirname, 'assets'), path.join(targetDir, 'assets'));
        mergeStyles(path.join(targetDir, 'style.css'));
        htmlBuild(path.join(__dirname, 'template.html'), path.join(targetDir, 'index.html'));

    });
});

//copy dir recursive
function copyContent(fromDir, toDir) {

    mkdir(toDir, { recursive: true }).then(() => {
        readdir(fromDir).then((res) => {
            for (let file of res) {

                let fullName = path.join(fromDir, file);
                let fullNameCopy = path.join(toDir, file);

                fs.stat(fullName, (err, stats) => {
                    if (err) throw err;
                    if (stats.isDirectory()) {
                        copyContent(fullName, fullNameCopy);
                    } else {
                        fs.createReadStream(fullName).pipe(fs.createWriteStream(fullNameCopy));
                    }
                });
            }
        });
    });
}

function mergeStyles(target) {

    let cssStream = fs.createWriteStream(target, { encoding: 'utf8' });

    readdir(stylesDir).then((res) => {
        for (let file of res) {
            if (path.extname(file) != '.css') continue;
            fs.stat(path.join(stylesDir, file), (err, stats) => {
                if (err) throw err;
                if (!stats.isDirectory()) {
                    fs.createReadStream(path.join(stylesDir, file))
                        .on('data', () => cssStream.write('\n/* ------' + file + ' ------ */\n'))
                        .pipe(cssStream);
                }
            });
        }
    });
}

function htmlBuild(template, target) {

    let html = '';
    let templateStream = fs.createReadStream(template, { encoding: 'utf8' });

    templateStream.on('data', chunk => {
        html += chunk.toString();
    });

    templateStream.on('end', () => {
        addContent(html, target);
    });
}

function addContent(html, target) {

    let ctx = {};
    let finish = 0;

    readdir(compDir).then((res) => {
        for (let file of res) {

            let fullName = path.join(compDir, file);
            let fileNameCont = file.replace(path.extname(file), '');
            ctx[fileNameCont] = '';

            fs.createReadStream(
                path.join(fullName))
                .on('data', (c) => { ctx[fileNameCont] += c.toString(); })
                .on('end', () => {
                    finish++;

                    //finish
                    if (finish >= res.length) {
                        for (let i in ctx) {
                            html = html.replace('{{' + i + '}}', ctx[i]);
                        }
                        let htmlStream = fs.createWriteStream(target, { encoding: 'utf8' });
                        htmlStream.write(html);
                    }
                });
        }
    });
}