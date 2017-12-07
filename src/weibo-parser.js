"use strict";

const puppeteer = require('puppeteer');

async function parse(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()

    await page.goto(url)
    await page.waitForSelector('.WB_feed_detail');

    const content = await page.evaluate(() => {
        const contentStr = document.querySelectorAll('.WB_text')[0].innerHTML
        let imgs = []
        let videopic = ''
        try {
            const actionData = document.querySelectorAll('.WB_media_wrap .WB_media_a')[0].getAttribute('action-data')
            const imgData = actionData.split('&').find(item => item.indexOf('clear_picSrc') === 0)
            const imgList = imgData.split('=')[1].split(',')
            imgs = imgList.map(img => 'https:' + decodeURIComponent(img))
        } catch (e) {
        }
        let videoSrc = ''
        try {
            const videoActionData = document.querySelectorAll('.WB_feed_detail li.WB_video')[0].getAttribute('video-sources')
            const videoData = videoActionData.split('&').find(item => item.indexOf('fluency') === 0)
            videoSrc = decodeURIComponent(videoData.split('=')[1].replace(/%25/g, '%'))

            const actionData = document.querySelectorAll('.WB_feed_detail li.WB_video')[0].getAttribute('action-data')
            const imgData = actionData.split('&').find(item => item.indexOf('cover_img') === 0)
            const coverImg = imgData.split('=')[1]
            videopic = 'https:' + decodeURIComponent(coverImg)
        } catch (e) {}

        return {
            title: document.title.replace(/\s来自.*/, ''),
            content: '<p>' + contentStr.replace(/<a\b[^>]*>(.*?)<\/a>/gi,"").replace(/^(\n)?\s+/g, '') + '</p>',
            imgs: imgs,
            video: videoSrc,
            videopic: videopic
        }
    });

    const imgStr = content.imgs.map(i => '<p><img src="' + i +'"/></p>').join('')

    browser.close()
    return {
        title: content.title,
        content: content.content + imgStr,
        video: content.video,
        videopic: content.videopic
    }
}

module.exports = parse