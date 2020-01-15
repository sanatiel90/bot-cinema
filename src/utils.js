export function currentDate(){
    var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
}

export function setMoviesResult(moviesArray){
    let msg = ''
    moviesArray.forEach(m => {
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

    return msg;

}