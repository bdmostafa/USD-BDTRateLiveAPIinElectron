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
