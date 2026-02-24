const axios = require('axios');
const crypto = require('crypto');

class ZeroGPTDetector {
    constructor() {
        this.apiUrl = 'https://api.zerogpt.com/api/detect/detectText';
        this.referer = 'https://www.zerogpt.com/';
        this.cookies = this.generateCookies();
    }

    generateCookies() {
        const timestamp = Date.now();
        const randomId = () => Math.random().toString(36).substring(2, 15);
        const uuid = () => crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : randomId() + randomId();
        
        return {
            '_gcl_au': `1.1.${Math.floor(Math.random() * 9000000000) + 1000000000}.${timestamp}`,
            '_ga': `GA1.1.${Math.floor(Math.random() * 9000000000) + 1000000000}.${timestamp}`,
            '_ga_0YHYR2F422': `GS2.1.s${timestamp}$o1$g0$t${timestamp}$j60$l0$h${Math.floor(Math.random() * 9000000000)}`,
            '__gads': `ID=${uuid().substring(0, 16)}:T=${timestamp}:RT=${timestamp}:S=ALNI_${randomId()}${randomId()}`,
            '__gpi': `UID=${uuid().substring(0, 16)}:T=${timestamp}:RT=${timestamp}:S=ALNI_${randomId()}${randomId()}`,
            '__eoi': `ID=${uuid().substring(0, 16)}:T=${timestamp}:RT=${timestamp}:S=AA-${randomId()}`,
            '_cc_id': uuid().substring(0, 32),
            'panoramaId_expiry': (timestamp + 604800000).toString(),
            'panoramaId': uuid() + uuid(),
            'panoramaIdType': 'panoDevice'
        };
    }

    getCookieString() {
        return Object.entries(this.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');
    }
    
    async detect(text) {
        try {
            const response = await axios.post(
                this.apiUrl,
                { input_text: text },
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Content-Type': 'application/json',
                        'Origin': 'https://www.zerogpt.com',
                        'Referer': this.referer,
                        'Cookie': this.getCookieString(),
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-site'
                    }
                }
            );

            return this.parseResponse(response.data);
        } catch (error) {
            throw error;
        }
    }
    
    parseResponse(data) {
        if (!data.success) {
            throw new Error(data.message || 'Detection failed / Deteksi gagal');
        }

        const result = data.data;
        return {
            isHuman: result.isHuman,
            isAI: 100 - result.isHuman,
            feedback: result.feedback,
            fakePercentage: result.fakePercentage,
            textWords: result.textWords,
            aiWords: result.aiWords,
            detectedLanguage: result.detected_language,
            additionalFeedback: result.additional_feedback,
            originalText: result.originalParagraph,
            sentences: result.sentences
        };
    }
}

async function main() {
    const detector = new ZeroGPTDetector();

    const text = "Saya mau tidur, tapi pikiran saya masih nyangkut di kamu. Katanya tidur bikin istirahat, tapi kenapa saya malah keinget kamu. Saya tutup mata, eh yang muncul malah kamu. Saya pengen tidur cepat, tapi kamu belum keluar dari kepala saya. Kalau saya susah tidur, biasanya karena kebanyakan mikirin kamu.";

    try {
        const result = await detector.detect(text);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log(JSON.stringify({ error: error.message }, null, 2));
    }
}

if (require.main === module) {
    main().catch(console.error);
}
