require('dotenv/config')
import axios from 'axios'
import cheerio from 'cheerio'

const url = process.env.URL

const getData = async () => {
    //add try catch
    const result = await axios.get(url)
    return result
}


const getResults = async () => {
    const movieData = []

    const response = await getData()

    const html = response.data

    const $ = cheerio.load(html)

    //elemento onde estão os dados das sessões
    const movieSessions = $('.movie-sessions')

    movieSessions.each((i, movie) => {
        //título do filme
        const title = $(movie).find('.movie-info > .movie-info__description > .movie-info__title').text()

        const sessionsData = [];

        let sessions = $(movie).find('.session__item')

        sessions.each((s, session) => {

            //nome do cinema
            const theater = $(session).find('.sessions__cinema').text();
            const scheduleData = []

            //horários
            let schedules = $(session).find('.label')

            schedules.each((x, sche) => {
                let piece = $(sche).text()
                scheduleData.push(piece)
            })

            const sessionItem = {
                theater,
                scheduleData
            }

            sessionsData.push(sessionItem)

        })

        const movieObject = {
            title,
            sessionsData
        }

        movieData.push(movieObject)
    })

    return movieData

}

export default getResults

/*const moviess = [
    {
        titulo: 'Parque Dinos',
        sessions: [
            {
                theater: 'Riomar',
                schedules: [
                    {
                        lang: 'DUB',
                        time: ['18:00', '19:00', '21:00']
                    },
                    {
                        lang: 'LEG',
                        time: ['15:00', '20:00']
                    }
                ]
            },
            {
                theater: 'Benfica',
                schedules: [
                    {
                        lang: 'DUB',
                        time: ['18:00', '19:00', '21:00']
                    },
                    {
                        lang: 'LEG',
                        time: ['15:00', '20:00']
                    }
                ]
            }
        ],

    },
]
*/
