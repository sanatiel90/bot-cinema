//trocando para usar require :/

//retorna data atual
//export function currentDate(){
exports.currentDate = function (){
    var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
}

//cria a msg com os filmes, com base nos resultados obtidos usando os comandos /filme e /cinema
//export function setMoviesResult(moviesArray){
exports.setMoviesResult = function(moviesArray){
    let msg = ''
    moviesArray.forEach(m => {
        msg += `<b>${m.title}</b>\n`

        m.sessionsData.forEach(s => {
            if(s.theater) msg += `- ${s.theater}\n`
            
            s.scheduleData.forEach(sc => {
                let piece = sc

                if (piece.indexOf(':') === -1) {
                    piece = `<b>${piece}</b>:`
                }

                msg += piece + ' ';

            })
            if(s.theater) msg += '\n'
        })
        msg += '-----------\n'
    })

    return msg;
}

//formata string de pesquisa informada para padronizar busca 
//export function formatSearch(searchStr){
exports.formatSearch = function (searchStr){
    const result = String(searchStr).replace(/,/g, ' ')
    return removerAcentosLocal(result)
}

//export function removerAcentos( newStringComAcento ) {
exports.removerAcentos = function (newStringComAcento) {
    var string = newStringComAcento;
    var mapaAcentosHex 	= {
        a : /[\xE0-\xE6]/g,
        A : /[\xC0-\xC6]/g,
        e : /[\xE8-\xEB]/g,
        E : /[\xC8-\xCB]/g,
        i : /[\xEC-\xEF]/g,
        I : /[\xCC-\xCF]/g,
        o : /[\xF2-\xF6]/g,
        O : /[\xD2-\xD6]/g,
        u : /[\xF9-\xFC]/g,
        U : /[\xD9-\xDC]/g,
        c : /\xE7/g,
        C : /\xC7/g,
        n : /\xF1/g,
        N : /\xD1/g
    };

    for ( var letra in mapaAcentosHex ) {
        var expressaoRegular = mapaAcentosHex[letra];
        string = string.replace( expressaoRegular, letra );
    }

    return string.toLowerCase();
}


const removerAcentosLocal = function(newStringComAcento) {
    var string = newStringComAcento;
    var mapaAcentosHex 	= {
        a : /[\xE0-\xE6]/g,
        A : /[\xC0-\xC6]/g,
        e : /[\xE8-\xEB]/g,
        E : /[\xC8-\xCB]/g,
        i : /[\xEC-\xEF]/g,
        I : /[\xCC-\xCF]/g,
        o : /[\xF2-\xF6]/g,
        O : /[\xD2-\xD6]/g,
        u : /[\xF9-\xFC]/g,
        U : /[\xD9-\xDC]/g,
        c : /\xE7/g,
        C : /\xC7/g,
        n : /\xF1/g,
        N : /\xD1/g
    };

    for ( var letra in mapaAcentosHex ) {
        var expressaoRegular = mapaAcentosHex[letra];
        string = string.replace( expressaoRegular, letra );
    }

    return string.toLowerCase();
}