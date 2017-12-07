"use strict";

// https://m.weibo.cn/status/4180848519653646

const puppeteer = require('puppeteer');
const log = console.log

async function parse(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()

    await page.goto(url)

    const content = await page.evaluate(() => {
        const data = window.$render_data.status
        console.log(data)
        const contentStr = data.text
        const imgs = data.pics ? data.pics.map(img => img.large.url) : []
        const videoEl = data.page_info
            ? data.page_info.type === 'video'
                ? data.page_info.media_info.stream_url
                : ''
            : ''
        let videopic = ''
        if (videoEl) {
            videopic = data.page_info.page_pic.url
        }
        return {
            title: data.status_title,
            content: '<p>' + contentStr.replace(/<a\b[^>]*>(.*?)<\/a>/gi,"").replace(/^(\n)?\s+/g, '') + '</p>',
            imgs: imgs,
            video: videoEl.replace(/\?.+/, ''),
            videopic: videopic
        }
    });

    const imgStr = content.imgs.map(i => '<p><img src="' + i +'"/></p>').join('')
    browser.close()
    return {
        title: content.title,
        content: content.content + imgStr,
        video: content.video
    }
}

module.exports = parse