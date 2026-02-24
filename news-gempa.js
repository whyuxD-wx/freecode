const axios = require('axios');
const cheerio = require('cheerio');

async function Gempa() {
    const url = 'https://pmijakartabarat.or.id/bmkg-infogempa'; 
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const listItems = $('ul.list-chevron-circle.orange li');
        const data = {}
        listItems.each((i, el) => {
            const text = $(el).text().trim();
            const [key, value] = text.split(' : ');
            data[key.replace(/\*\*/g, '').trim()] = value ? value.trim() : ''
        })
        const imgSrc = $('div.dez-post-media img').attr('src')
        if (imgSrc) {
            data.image = imgSrc;
        }
        console.log(JSON.stringify(data, null, 2))
        return data;
    } catch (error) {
        console.error('Error scraping data:', error)
        return null
    }
}

Gempa();
