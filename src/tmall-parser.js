"use strict";

// https://detail.tmall.com/item.htm?id=549481851552&spm=a219t.7900221/10.1998910419.d30ccd691.3928570b133HqY
// //cloud.video.taobao.com/play/u/832467178/p/1/e/6/t/1/50014368388.mp4
// //cloud.video.taobao.com/play/u/832467178/p/1/e/6/t/1/50031396907.mp4

const puppeteer = require('puppeteer');

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
    await page.waitForSelector('.tm-video-box video.lib-video');

    const content = await page.evaluate(() => {
        return {
            title: document.title.replace(/\-淘宝网/, ''),
            content: '',
            imgs: [],
            video: document.querySelectorAll('.tm-video-box video.lib-video')[0].src,
            videopic: document.querySelectorAll('.tm-video-box video.lib-video')[0].poster
        }
    });

    browser.close()
    return content
}

module.exports = parse