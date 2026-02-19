const cheerio = require('cheerio')
const axios = require('axios')

async function tiktokstalk(username){
    try{
        if(!username) throw Error('username required')
        const html = await axios.get(
            'https://www.tiktok.com/@' + username,
            {
                headers:{
                    'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
                    'Accept':'text/html'
                }
            }
        ).then(r => r.data)
        const pick = function(re){
            const m = html.match(re)
            return m ? m[1] : null
        }
        return {
            username : pick(/"uniqueId":"([^"]+)"/),
            name : pick(/"nickname":"([^"]+)"/),
            bio : pick(/"signature":"([^"]*)"/),
            followers : pick(/"followerCount":(\d+)/),
            following : pick(/"followingCount":(\d+)/),
            likes : pick(/"heartCount":(\d+)/),
            videoCount : pick(/"videoCount":(\d+)/),
            avatar : pick(/"avatarLarger":"([^"]+)"/)?.replace(/\\u002F/g,'/')
        }
    } catch(e){
        return { status:'error', msg:e.message }
    }
}

async function mainStalk(username){
    let result
    for(let i = 1; i <= 10; i++){
        result = await tiktokstalk(username)
        if(result?.status !== 'error'){
            return result
        }
        await new Promise(r => setTimeout(r, 2000))
    }
    return result
}

;(async () => {
    const y = await mainStalk("whyux_d")
    console.log(y)
})()
