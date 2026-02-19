const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')

async function tikDownVideo(url) {
    try {
        const data = qs.stringify({
            'url': url,
            '_token': 'x1f8cyGUEaXXHLxtfZs1krBaosaxWzQcsgPKIxa8' 
        });
        const config = {
            method: 'post',
            url: 'https://kol.id/download-video/tiktok',
            headers: { 
                'authority': 'kol.id', 
                'accept': '*/*', 
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
                'origin': 'https://kol.id', 
                'referer': 'https://kol.id/download-video/tiktok', 
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', 
                'x-requested-with': 'XMLHttpRequest',
                'cookie': '_gcl_au=1.1.402207708.1771535640; _ga=GA1.1.2012067091.1771535640; _fbp=fb.1.1771535640679.694440052973966284; _tt_enable_cookie=1; _ttp=01KHVW1A6JDQFJ2PRZY816GQJE_.tt.1; XSRF-TOKEN=eyJpdiI6IjM2bU52QnJJZDgxSk9VKytscDFva0E9PSIsInZhbHVlIjoiT25LSDNIaTdzeld2YkczVFBKZ3NSVEpncEJzWDI5NXpvVXRHTktYaitOV1E0RjlzRmVXTFJ6NXFLVHY3NW1TTTlwcHhvTktrbnR4bDVnVEhVR3JWQzRhZUc5bTlQUis1Q2t1cXREM0twNXhCYUFwR01RRm51bWJlV3JxMHoxUG8iLCJtYWMiOiIwNTExODAxZmRiZTZkZjk3Y2ZkMjk3YWQzODcxODFhMWY0NjNkMGM5NTlkNjhiNjJhOTA5NzFhMWU2MmE3N2ZhIiwidGFnIjoiIn0%3D; kolid_session=eyJpdiI6IjN0alJ3VXJSd2lKbXZQZkxnMnRXZGc9PSIsInZhbHVlIjoibk8wbTVPSWUyZy8rWXFyVWErc3VabUIvdHUrbWFsNzhvNWlmdkhkVXlsZDlvM1VCZFJPWGVjRlNBUit1bXVZdXlDVmNtNHdpV2l3bUdvM1hpWHBvdnhxODZGbURvSnJaM1FLWkJjVDFadHZab1JaUExUbU1uWC9zMzhjcW5iU2UiLCJtYWMiOiI1MjQ4MDMxNDE5ZTRmNGVkNzIxZDFmMTk0MTk1ODk5NmJkMTNjOTY0Njc2N2JlMjViNDgxNmE3YzQxNDM4NzhkIiwidGFnIjoiIn0%3D; ttcsid=1771535640801::aaSXnXTQzl3pkvaXSHE3.1.1771535658033.0; ttcsid_CU96RHBC77UBVOTKOTN0=1771535640799::6BOtF8IC7p4qo_pvAW9A.1.1771535658034.0; _ga_JWHZ1GHQ0S=GS2.1.s1771535640$o1$g0$t1771535658$j42$l0$h1614997423' 
            },
            data: data
        }
        const response = await axios(config)
        if (response.data && response.data.status) {
            const $ = cheerio.load(response.data.html)
            const result = {
                title: $('.small-title h2').text().trim(),
                author: $('.time-details span').text().trim(),
                thumbnail: $('#popupCover').attr('src'),
                links: {
                    video_with_watermark: $('.growth-btn').attr('href'),
                    video_no_watermark: $('.dropdown-menu li:nth-child(1) a').attr('href'),
                    audio_mp3: $('.dropdown-menu li:nth-child(2) a').attr('href')
                }
            }
            return result
        } else {
            throw new Error("gagal cik")
        }
    } catch (error) {
        console.error('Error:', error.message)
        return null;
    }
}

// usage
const t = 'https://vt.tiktok.com/ZSmPQ8C4w'
tikDownVideo(t).then(res => {
    console.log(JSON.stringify(res, null, 2))
})
