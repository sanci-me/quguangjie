// http://m.huajuanmall.com/rec/detail/7553
// -> http://m.huajuanmall.com/video/detail?video_id=7553

"use strict";

const request = require('request')

function fetchData(url) {
    const requestUrl = url.replace(/\/rec\/detail\/(\d+)/, '/video/detail?video_id=$1')

    return new Promise((resolve, reject) => {
        request({url: requestUrl, json: true}, function (err, httpResponse, body) {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}

async function parse(url) {
    const data = await fetchData(url)
    return {
        title: data.video.video_title,
        content: '',
        video: data.video.video_url,
        videopic: data.vide.image_url
    }
}

module.exports = parse