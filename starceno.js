const axios = require('axios')
const cheerio = require('cheerio')

const topeng =
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

async function intipGerbang(targetRumah) {
    const { data } = await axios.get(targetRumah, {
        headers: { 'User-Agent': topeng }
    })
    const $ = cheerio.load(data)
    const hasilRampasan = []
    $('article.post').each((_, pintu) => {
        const title = $(pintu).find('h2.post-title a').text().trim()
        const url = $(pintu).find('h2.post-title a').attr('href')
        if (title && url) {
            hasilRampasan.push({
                title: title,
                link: url
            })
        }
    })
    return hasilRampasan
}

async function bobolPintu(url) {
    const { data } = await axios.get(url, {
        headers: { 'User-Agent': topeng }
    })
    const $ = cheerio.load(data)
    const kamar = $('div.post-body.entry-content')
    const namaTarget = kamar.find('p b').first().text().trim()
    const catatanRahasia = kamar
        .find('p')
        .first()
        .clone()
        .find('b')
        .remove()
        .end()
        .text()
        .replace(/\s+/g, ' ')
        .trim()
    const fotoBukti = kamar
        .find('td[style*="text-align: center"] img')
        .first()
        .attr('src')
    let videoCurian = null
    kamar.find('blockquote a[href]').each((_, celah) => {
        const href = $(celah).attr('href')
        if (!videoCurian && href && href.endsWith('.mp4')) {
            videoCurian = href
        }
    })

    return {
        name: namaTarget,
        description: catatanRahasia,
        thumbnail: fotoBukti,
        url_video: videoCurian
    }
}

async function operasiMalam() {
    const markasTarget = 'https://www.starceno.com/'
    const pintu = await intipGerbang(markasTarget)
    const barangCurian = []
    for (const target of pintu) {
        try {
            const isiBrankas = await bobolPintu(target.link)
            barangCurian.push(isiBrankas)
        } catch (err) {
            console.log('Gagal bobol:', target.link)
        }
    }
    console.log(JSON.stringify(barangCurian, null, 2))
}

//usage
//operasiMalam()
