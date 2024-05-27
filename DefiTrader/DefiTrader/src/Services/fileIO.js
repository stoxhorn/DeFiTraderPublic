const fs = require('fs');
const createChildLog = require("#Services/loggerService.js");
const path = require("path").basename(__filename)
const log = createChildLog(path)


class fileIO{

    static  readFile(fileName){
        log.info("fetching file: " + fileName)
        return fs.readFileSync(fileName, 'utf8')
    }

    static async readJson(fileName) {
        log.info("converting " + fileName + " to JSON");
        const contents = this.readFile(fileName)
        return JSON.parse(contents)
    }

    static async writeFile(fileName, contents){
        log.info("writing file: " + fileName)
        const stream = fs.createWriteStream(fileName);
        stream.once('open', function () {
            stream.write(contents);
            stream.end();
        });
    }
}
module.exports = fileIO
