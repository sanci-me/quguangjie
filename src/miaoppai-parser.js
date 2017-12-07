"use strict";

const puppeteer = require('puppeteer');

async function parse(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()

    await page.goto(url)
    await page.waitForSelector('.video-player');

    const content = await page.evaluate(() => {
        const contentStr = document.querySelectorAll('.viedoAbout p')[0].innerHTML
        const videoEl = document.querySelectorAll('.video-player video')[0]
        return {
            title: document.title.replace(/\-[^-]*的秒拍/, ''),
            content: '<p>' + contentStr.replace(/<a\b[^>]*>(.*?)<\/a>/gi,"").replace(/^(\n)?\s+/g, '') + '</p>',
            imgs: [],
            video: videoEl.src.replace(/\?.+/, '')
        }
    });

    browser.close()
    return {
        title: content.title,
        content: content.content,
        video: content.video
    }
}

module.exports = parse