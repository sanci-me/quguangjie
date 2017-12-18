"use strict";

const puppeteer = require('puppeteer')
const request = require('request')

function fetchData(videoApiUrl) {
    return new Promise((resolve, reject) => {
        request({url: videoApiUrl, json: true}, function (err, httpResponse, body) {
            if (err) {
                reject(err)
            } else {
                const url =  new Buffer(body.data.video_list.video_1.main_url, 'base64').toString()
                resolve(url)
            }
        })
    })
}

async function loadVideoInfo (url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()
    page.on('error', (err) => {
        console.error('error occured, page crashed');
        console.error(err)
        browser.close()
        process.exit()
    })

    await page.goto(url)

    const content = await page.evaluate(() => {
        function crc32 (t) {
            var e = document.createElement("a");
            e.href = t;
            var n = function() {
                for (var t = 0, e = new Array(256), n = 0; 256 != n; ++n)
                    t = n,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        t = 1 & t ? -306674912 ^ t >>> 1 : t >>> 1,
                        e[n] = t;
                return "undefined" != typeof Int32Array ? new Int32Array(e) : e
            }()
                , o = function(t) {
                for (var e, o, r = -1, i = 0, a = t.length; i < a; )
                    e = t.charCodeAt(i++),
                        e < 128 ? r = r >>> 8 ^ n[255 & (r ^ e)] : e < 2048 ? (r = r >>> 8 ^ n[255 & (r ^ (192 | e >> 6 & 31))],
                                                                               r = r >>> 8 ^ n[255 & (r ^ (128 | 63 & e))]) : e >= 55296 && e < 57344 ? (e = (1023 & e) + 64,
                        o = 1023 & t.charCodeAt(i++),
                        r = r >>> 8 ^ n[255 & (r ^ (240 | e >> 8 & 7))],
                        r = r >>> 8 ^ n[255 & (r ^ (128 | e >> 2 & 63))],
                        r = r >>> 8 ^ n[255 & (r ^ (128 | o >> 6 & 15 | (3 & e) << 4))],
                        r = r >>> 8 ^ n[255 & (r ^ (128 | 63 & o))]) : (r = r >>> 8 ^ n[255 & (r ^ (224 | e >> 12 & 15))],
                        r = r >>> 8 ^ n[255 & (r ^ (128 | e >> 6 & 63))],
                        r = r >>> 8 ^ n[255 & (r ^ (128 | 63 & e))]);
                return r ^ -1
            }
                , r = e.pathname + "?r=" + Math.random().toString(10).substring(2);
            "/" != r[0] && (r = "/" + r);
            var i = o(r) >>> 0
                , a = location.protocol.indexOf("http") > -1;
            return (a ? [location.protocol, e.hostname] : ["http:", e.hostname]).join("//") + r + "&s=" + i
        }

        const remoteUrl = 'http://ib.365yg.com/video/urls/v/1/toutiao/mp4/'
        const videoId = window.player.videoid
        const requestUrl = crc32(remoteUrl + videoId)
        return {
            videoApiUrl: requestUrl,
            title: window.abstract.title
        }
    })

    browser.close()

    return content
}

async function parse (url) {
    const videoInfo = await loadVideoInfo(url)
    const data = await fetchData(videoInfo.videoApiUrl)
    return {
        title: videoInfo.title,
        content: '',
        video: data,
        videopic: ''
    }
}

module.exports = parse