const {ethers} = require("ethers");

// const createChildLog = require("#Services/loggerService.js");
const path = require("path").basename(__filename)
const log = global.loggerParent.child({a: path})
const fileIO = require("#Services/fileIO.js")

class walletService {

     static createWallet(extraEntropy = null | Object){
        log.info("with extra entropy: " + extraEntropy)
        return ethers.Wallet.createRandom(extraEntropy)
    }

    static async loadWallet(pwd = null | String){
        /*
        * Returns a Waller object, not an HDNodeWallet
        * https://docs.ethers.org/v6-beta/api/wallet/#Wallet
        * */
         log.info("reading encrypted wallet json")
        const json = fileIO.readFile("./conf/wallet.json")
        log.info("creating wallet from encrypted json")
        return ethers.Wallet.fromEncryptedJsonSync(json.toString(), pwd.toString())
    }

    static async createAndStoreWallet(extraEntropy = null | Object, pwd = null | String){
        // TODO: potential error handling? not sure how this shit would fail, but would be nice to have somewhere
         let logMsg = "creating and storing a new random wallet"
        if(extraEntropy !== null){
            logMsg += ", with extraEntropy = " + extraEntropy.toString() + " "}
        if (pwd !== null){
            logMsg += ", with pwd = " + pwd.toString() + " "}

        log.info(logMsg)


        const wallet = await walletService.createWallet(extraEntropy)

        log.info("encrypting wallet to json")
        let walletJson;
        // Will make a file without password, if no argument is provided
        // will throw error if pwd is null or uninitialized
        if(pwd === null){
        }
        else{
            // idk why, but javascript will make pwd a zero if it's empty or null
            walletJson = await wallet.encrypt(pwd.toString())
        }

        log.info("Save the file under ./conf")
        // makes the JSON string not be one line, but multilines
        const prettyJSON = JSON.stringify(JSON.parse(walletJson), 0, 2)
        await fileIO.writeFile("./conf/wallet.json", prettyJSON)
        log.info("Successfully created wallet file")
    }
}
module.exports = walletService