"use strict";

// 'http://www.miaopai.com/show/bK4ijTC9PPvefS-coZbeMysZfjQT-KuqpPfLuA__.htm'

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
        process.exit()
    })

    await page.goto(url)
    await page.waitForSelector('.video-player')
        .catch(err => {
            console.error('error occured, page timeout')
            console.error(err)
            browser.close()
            process.exit()
        })

    const content = await page.evaluate(() => {
        const contentStr = document.querySelectorAll('.viedoAbout p')[0].innerHTML
        const videoEl = document.querySelectorAll('.video-player video')[0]
        return {
            title: document.title.replace(/\-[^-]*的秒拍/, ''),
            content: '<p>' + contentStr.replace(/<a\b[^>]*>(.*?)<\/a>/gi,"").replace(/^(\n)?\s+/g, '') + '</p>',
            imgs: [],
            video: videoEl.src.replace(/\?.+/, ''),
            videopic: videoEl.poster
        }
    });

    browser.close()
    return {
        title: content.title,
        content: content.content,
        video: content.video,
        videopic: content.videopic
    }
}

module.exports = parse