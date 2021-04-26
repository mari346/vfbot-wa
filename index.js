const { create } = require('@open-wa/wa-automate')
const { color, options } = require('./function')
const figlet = require('figlet')
//const fs = require('fs-extra')
const videfikri = require('./videfikri.js')
const config = require('./config.json')
const ownerNumber = config.owner

const start = async (vf = new vf()) => {
    console.log(color(figlet.textSync('VF BOT', '3D Diagonal'), 'magenta'))
    console.log(color('[VF BOT]', 'magenta'), color('VF BOT is now online!', 'aqua'))
    
    vf.onStateChanged((state) => {
        console.log(color('-> [STATE]'), state)
        if (state === 'CONFLICT') vf.forceRefocus()
        if (state === 'UNPAIRED') vf.forceRefocus()
    })

    vf.onAddedToGroup(async (chat) => {
        await vf.sendText(chat.groupMetadata.id, 'Desculpe, Este bot não está disponível para o grupo!')
        await vf.leaveGroup(chat.groupMetada.id)
    })

    vf.onMessage((message) => {
        videfikri(vf, message)
    })

    vf.onIncomingCall(async (call) => {
        await vf.sendText(call.peerJid, `Você chamou o BOT\nDesculpe, você será bloqueado!\nChat owner: wa.me/${ownerNumber} a fim de ser desbloqueado!`)
        await vf.contactBlock(call.peerJid)
            .then(() => console.log(`Alguém chamou BOT, e foi bloqueado. ID: ${call.peerJid}`))
    })
}
create(options(start))
    .then((vf) => start(vf))
    .catch((err) => console.error(err))
