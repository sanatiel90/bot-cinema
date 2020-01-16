require('dotenv/config')
const express = require('express')
import bot from './bot'

const app = express()

bot.launch()

app.listen(3333, () => console.log('Bot Lanched at 3333'))