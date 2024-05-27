const createChildLog = require("#Services/loggerService.js")
const express = require("express");
const { Worker } = require("worker_threads");
const { ethers} = require("ethers");


const walletService = require('#Services/walletService.js')
const ServerControl = require("#Control/ServerControl.js")
const path = require("path")
const pathBaseName = require("path").basename(__filename)
const log = global.loggerParent.child({a: pathBaseName})


const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;
let sc;


/*
* Remember to try and keep this script to be about controlling the frontend stuff, and put controller logic in serverControl
* */


app.use('/conf', express.static('public'))

app.get("/", async (req, res) => {
    const provider = await ServerControl.fetchProvider()
    sc = new ServerControl(provider)
    res.render('pages/index');
});

app.get("/create_wallet", async (req, res) => {
    res.status(200).send(sc.createWallet())
});

app.get("/load_wallet", async (req, res) => {
    await sc.loadWallet()

    const address = await sc.getAddress()
    const balance = await sc.getBalance()
    //const signer = await provider.getSigner()

    res.render('pages/index',{
        address: address,
        balance: balance.toString()
    });
});


app.listen(port, () => {
    console.log(`App listening on localhost:${port}/`);
});