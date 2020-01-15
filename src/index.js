require('dotenv/config')
const express = require('express')
const Telegraf = require('telegraf')
const commandParts = require('telegraf-command-parts');
import getResults from './scrap'
import { currentDate, setMoviesResult } from './utils'

const app = express()

const bot = new Telegraf(process.env.BOT_TOKEN)

app.use(commandParts())

bot.start((ctx) => {
    let msg = `Bem vindo, ${ctx.chat.first_name}! \nUse o comando /filmes para receber a lista de filmes em cartaz em Fortaleza! \n`
    msg += `Se quiser procurar por filmes de um cinema específico, use o comando \n/cinema junto com o nome do cinema que deseja procurar (/cinema Iguatemi)\n`
    msg += `Caso queira ver as sessões de um filme em particular, use o comando \n/filme junto com o nome do filme (/filme Senhor dos Anéis)`
    ctx.reply(msg)
})

bot.command('filmes', async (ctx) => {
    const movieData = await getResults()

    let msg = `<b>Filmes em cartaz hoje - ${currentDate()}</b>\n`
    msg += '------------------\n'
    movieData.forEach(m => {
        msg += `<b>${m.title}</b>\n`

        m.sessionsData.forEach(s => {
            msg += `- ${s.theater}\n`

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
 
//bot.on(/\/echo (.*)/, (ctx) =>  ctx.reply(`Aqui vou pegar a exata msg q vc escreveu, e mostrar em ${ctx.message.text} ? `))

//comando iniciado por /filme vai fazer busca por filme
bot.hears(/\/filme/, async (ctx) => { 
    const params = ctx.message.text.split(' ')
    const movieArg = params.slice(1)
    const movieSearch = String(movieArg).replace(/,/g, ' ')
    
    if (movieSearch === null || movieSearch === ''){
        ctx.reply(`Por favor, me informe o nome do filme que você deseja assistir para que eu possa pesquisar!`)    
        return
    } 

    //resultado do scrap de movies
    const movieData = await getResults()

    //filtra de acordo com a pesquisa informada
    const moviesFilter = movieData.filter(m => (
        m.title.search(movieSearch) !== -1
    ))
    
    moviesFilter.length > 0 ?  
        msg = setMoviesResult(moviesFilter)  
        : 
        msg = `Não foram encontrados filmes com a pesquisa '${movieSearch}', por favor refine sua busca, ou acesse a listagem geral de filmes através do comando /filmes`;

    ctx.reply(msg, { parse_mode: 'HTML' })     
})

bot.hears(/\/cinema/, async (ctx) => {
    const params = ctx.message.text.split(' ')
    const cinemaArg = params.slice(1)
    const cinemaSearch = String(cinemaArg).replace(/,/g, ' ')
    
    if (cinemaSearch === null || cinemaSearch === ''){
        ctx.reply(`Por favor, me informe o nome do cinema para qual deseja ver as sessões!`)    
        return
    } 
        
    ctx.reply(`Ok, você quer procurar por filmes no cinema ${cinemaSearch}!  `) 

    

})

bot.launch()

app.listen(3333, () => console.log('Bot Lanched at 3333'))