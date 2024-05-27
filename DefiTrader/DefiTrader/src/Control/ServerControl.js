const {ethers, Provider} = require("ethers");
const walletService = require("#Services/walletService.js");
const path = require("path").basename(__filename)
const log = global.loggerParent.child({a: path})
const fileIO = require("#Services/fileIO.js")

class ServerControl {

    constructor(newProvider) {
        this.provider = newProvider;
        this.walletLoaded = false
    }

    get_provider(){
        return this.provider
    }

    walletIsLoaded(){
        return this.walletLoaded
    }

    async getAddress(){
        if (this.walletIsLoaded()){
            return this.wallet.address
        }
    }

    async getBalance(){
        if (this.walletIsLoaded()){
            return this.provider.getBalance(this.wallet.address)
        }
    }

    static async fetchProvider(){
        let signer = null;
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        log.info("MetaMask not installed; using read-only defaults")
        const userJSON = fileIO.readJson("./conf/user.json")
        const url = userJSON["HTTP_Provider"]

        return new ethers.QuickNodeProvider(url)

    }

    async createWallet(){
        let retStr = ""
        if(this.provider != null){

            retStr = "creating wallet file"
            await walletService.createAndStoreWallet()
        }
        else{
            retStr = "Haven't connected yet"
        }
        return retStr
    }
    async loadWallet(){
        let retStr = ""
        if(this.provider != null){
            this.wallet = await walletService.loadWallet()
            this.walletLoaded = true
            return "Successfully loaded wallet"
        }
        else{
            retStr = "Haven't connected yet"
        }
        return retStr
    }
}

module.exports = ServerControl