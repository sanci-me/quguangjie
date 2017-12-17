"use strict";

const puppeteer = require('puppeteer');
const weiboTTArticleParser = require('./weibo-ttarticle-parser')

async function parse(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()
    page.on('error', (err) => {
        console.error('error occured, page crashed');
        console.error(err)
        browser.close()
    })

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
        // weibo toutiao wenzhang 解析
        let ttArticleUrl = ''
        try {
            const ttArticle = document.querySelectorAll('.WB_media_wrap div[action-type="widget_articleLayer"]')[0]
            if (ttArticle) {
                const ttData = ttArticle.getAttribute('action-data').split('&').find(item => item.indexOf('url') === 0)
                ttArticleUrl = 'https:' + decodeURIComponent(ttData.split('=')[1])
            }
        } finally {}

        let videoSrc = ''
        try {
            const videoActionData = document.querySelectorAll('.WB_feed_detail li.WB_video')[0].getAttribute('video-sources')
            const videoData = videoActionData.split('&').find(item => item.indexOf('fluency') === 0)
            videoSrc = decodeURIComponent(videoData.split('=')[1].replace(/%25/g, '%'))

            const actionData = document.querySelectorAll('.WB_feed_detail li.WB_video')[0].getAttribute('action-data')
            const imgData = actionData.split('&').find(item => item.indexOf('cover_img') === 0)
            const coverImg = imgData.split('=')[1]
            videopic = decodeURIComponent(coverImg)
        } catch (e) {}

        return {
            title: document.title.replace(/\s来自.*/, ''),
            content: '<p>' + contentStr.replace(/<a\b[^>]*>(.*?)<\/a>/gi,"").replace(/^(\n)?\s+/g, '') + '</p>',
            imgs: imgs,
            video: videoSrc,
            videopic: videopic,
            ttArticleUrl: ttArticleUrl
        }
    });
    browser.close()
    const imgStr = content.imgs.map(i => '<p><img src="' + i +'"/></p>').join('')
    let detailContent = content.content + imgStr
    const ttArticleUrl = content.ttArticleUrl
    if (ttArticleUrl) {
        console.log(ttArticleUrl)
        detailContent = await weiboTTArticleParser(ttArticleUrl)
        return detailContent
    }

    return {
        title: content.title,
        content: detailContent,
        video: content.video,
        videopic: content.videopic
    }
}

module.exports = parse