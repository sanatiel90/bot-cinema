require('dotenv/config')
const express = require('express')
const bot = require('./bot')
//import bot from './bot'

const app = express()

const port = process.env.PORT || 3333 

bot.launch()

app.get('/', (req, res) => {
    res.send('Bot CinemaFortaleza rodando :D')
})

app.listen(port, () => console.log(`Bot Lanched at port ${port}`))