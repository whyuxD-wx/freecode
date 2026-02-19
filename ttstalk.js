const cheerio = require('cheerio')
const axios = require('axios')

async function tiktokstalk(username){
    try{
        if(!username) throw Error('username required')
        html = await axios.get(
            'https://www.tiktok.com/@' + username,
            {
                headers:{
                    'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
                    'Accept':'text/html'
                }
            }
        ).then(r => r.data)
        pick = function(re){
            m = html.match(re)
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

(async () => {
const y = await tiktokstalk("whyux_d")
console.log(y)
})()
