// add.js ======================
const electron = require('electron')
const path = require('path')
// const {remote} = electron
const remote = electron.remote
const ipc = electron.ipcRenderer

// Close the window
const closeBtn = document.getElementById('close-btn')

closeBtn.addEventListener('click', function(event) {
    var win = remote.getCurrentWindow();
    win.close();
})

const updateBtn = document.getElementById('update-btn')

updateBtn.addEventListener('click', function() {
    ipc.send('update-notify-value', document.getElementById('notify-value').value);

    // Close the window
    var win = remote.getCurrentWindow();
    win.close();
})


// index.js ================================
const electron = require('electron')
// const url = require('url');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow
// Promise based HTTP client for the browser and node.js
const axios = require('axios')
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notify-btn')
var prc = document.querySelector('h1')
var targetPrice = document.getElementById('target-prc')
var targetPriceValue

// Notification variable
const notification = {
    title: 'BDT Rate Alert',
    body: 'Your BDT just exceeded your target price!',
    icon: path.join(__dirname, '../assets/img/icon.png')
}

// Conversion function with api ====================================
// https://min-api.cryptocompare.com/
// https://api.currencylayer.com/convert?from=USD&to=BDT&amount=1
function getBDT() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=USD&tsyms=BDT')
        .then(res => {
            const bdt = res.data.USD.BDT
            prc.innerHTML = '৳'+bdt.toLocaleString('bn')

            // Notification alert body
            if(targetPrice.innerHTML != '' && targetPriceValue < res.data.USD.BDT) {
                const myNotification = new window.Notification(notification.title, notification);
            }

            // myNotification.onclick (() => {
            //     console.log('clicked')
            // }) 
        })
        .catch( function (err) {
            throw err;
        })
}

getBDT();
setInterval (getBDT, 30000);

notifyBtn.addEventListener('click', function(event) {
    let win = new BrowserWindow({
        width: 450,
        height: 200,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.on('close', () => { win = null })
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'add.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))

    win.loadFile(path.join(__dirname, 'add.html'))

    win.show()
    // win.webContents.openDevTools()
})

ipc.on('targetPriceValue', function(event, arguments) {
    targetPriceValue = Number(arguments)
    targetPrice.innerHTML = '৳ '+targetPriceValue.toLocaleString('bn')
})
