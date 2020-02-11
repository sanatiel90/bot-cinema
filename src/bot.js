//trocando para usar require :/
const Telegraf = require('telegraf')
//import getResults from './scrap'
const getResults = require('./scrap')
//import { currentDate, setMoviesResult, removerAcentos, formatSearch } from './utils'
const { currentDate, setMoviesResult, removerAcentos, formatSearch } = require('./utils')

const bot = new Telegraf(process.env.BOT_TOKEN)

/* COMANDOS DO BOT */

/* /start => mensagem de boas vindas */
bot.start((ctx) => {
    let msg = `Bem vindo, ${ctx.chat.first_name}! \nUse o comando /filmes para receber a lista de filmes em cartaz em Fortaleza! \n`
    msg += `Se quiser procurar por filmes de um cinema específico, use o comando \n/cinema junto com o nome do cinema que deseja procurar (/cinema Iguatemi)\n`
    msg += `Caso queira ver as sessões de um filme em particular, use o comando \n/filme junto com o nome do filme (/filme Senhor dos Anéis)`
    ctx.reply(msg)
})

/* /filmes => lista todos os filmes */
bot.command('filmes', async (ctx) => {

    const movieData = await getResults()

    let msg = `<b>Filmes em cartaz hoje - ${currentDate()}</b>\n`
    msg += '-----------\n'

    let msg2 = ''
    movieData.forEach(m => {
        //msg do telegram aceita no máximo 4096 caracteres
        if(msg.length < 3300) { 
            msg += `<b>${m.title}</b>\n`

            m.sessionsData.forEach(s => {
                msg += `- ${s.theater}\n`

                s.scheduleData.forEach(sc => {
                    let piece = sc

                    if (piece.indexOf(':') === -1) {
                        piece = `<b>${piece}</b>:`
                    }

                    msg += piece + ' ';

                })
                msg += '\n'
            })
            msg += '-----------\n'

        } else {
            //caso a msg ja tenha passado de 3300 caracteres, utilizar msg2 para criar outra msg com o restante da informacao
            msg2 += `<b>${m.title}</b>\n`

            m.sessionsData.forEach(s => {
                msg2 += `- ${s.theater}\n`

                s.scheduleData.forEach(sc => {
                    let piece = sc

                    if (piece.indexOf(':') === -1) {
                        piece = `<b>${piece}</b>:`
                    }

                    msg2 += piece + ' ';

                })
                msg2 += '\n'
            })
            msg2 += '-----------\n'
        }
    })

    ctx.reply(msg, { parse_mode: 'HTML' }) 
    if(msg2 !== '')  ctx.reply(msg2, { parse_mode: 'HTML' }) 
    
})

/* /filme @nomeDoFilme  => faz busca por um filme em específico */
bot.hears(/\/filme/, async (ctx) => { 
    const params = ctx.message.text.split(' ')
    const movieArg = params.slice(1)
    const movieSearch = formatSearch(movieArg)
    
    if (movieSearch === null || movieSearch === ''){
        ctx.reply(`Por favor, me informe o nome do filme que você deseja assistir para que eu possa pesquisar!`)    
        return
    } 

    //resultado do scrap de movies
    const movieData = await getResults()

    //filtra de acordo com a pesquisa informada
    const moviesFilter = movieData.filter(m => {
        const title = removerAcentos(m.title)
        return title.search(movieSearch) !== -1
    })

    let msg = '' 
    moviesFilter.length > 0 ?  
        msg = setMoviesResult(moviesFilter)  
        : 
        msg = `Não foram encontrados filmes com a pesquisa '${movieSearch}', por favor refine sua busca, ou acesse a listagem geral de filmes através do comando /filmes`;

    ctx.reply(msg, { parse_mode: 'HTML' })     
})

/* /cinema @nomeDoCinema  => faz busca por filmes em um determinado cinema */
bot.hears(/\/cinema/, async (ctx) => {
    const params = ctx.message.text.split(' ')
    const cinemaArg = params.slice(1)
    const cinemaSearch = formatSearch(cinemaArg) 
    
    if (cinemaSearch === null || cinemaSearch === ''){
        ctx.reply(`Por favor, me informe o nome do cinema para qual deseja ver as sessões!`)    
        return
    } 
        
    //resultado do scrap de movies
    const movieData = await getResults()

    //filtra filmes de um cinema de acordo com a pesquisa informada
    const moviesFilter = movieData.filter(m => {
        let match = false
        m.sessionsData.filter(s => {
            const theaterName = removerAcentos(s.theater)
            //so adicionar as sessoes que pertecerem ao cinema informado
            if(theaterName.search(cinemaSearch) !== -1){
                match = true
                return true
            } else {
                //apagando sessoes de outros cinemas
                s.theater = ''
                s.scheduleData = []
                return false
            }
        })
        if(match) return true //retorna apenas os movies do cinema informado
    })

    let msg = '' 
    moviesFilter.length > 0 ?  
        msg = setMoviesResult(moviesFilter)  
        : 
        msg = `Não foram encontrados cinemas com a pesquisa '${cinemaSearch}', por favor refine sua busca, ou acesse a listagem geral de filmes através do comando /filmes`;

    ctx.reply(msg, { parse_mode: 'HTML' })     
})

module.exports = bot


//bot.on(/\/echo (.*)/, (ctx) =>  ctx.reply(`Pega a exata msg q a pessoa escreveu, e mostra em ${ctx.message.text} `))

