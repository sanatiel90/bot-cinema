require('dotenv/config')
const express = require('express')
const Telegraf = require('telegraf')
import getResults from './scrap'

const app = express()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Bem vindo! use o comando /filmes para receber a lista de filmes em cartaz em Fortaleza!'))

bot.command('filmes', async (ctx) => {
    const movieData = await getResults()

    let msg = ''
    movieData.forEach(m => {
        msg += `<b>${m.title}</b>\n`

        m.sessionsData.forEach(s => {
            msg += `${s.theater} \n`

            s.scheduleData.forEach(sc => {
                let piece = sc

                if (piece.indexOf(':') === -1) {
                    piece = `<b>${piece}</b> `
                }

                msg += piece + ' ';

            })
            msg += '\n'
        })
        msg += '------------------\n'
    })

    ctx.reply(msg, { parse_mode: 'HTML' })
})

bot.launch()

app.listen(3333, () => console.log('Bot Lanched at 3333'))