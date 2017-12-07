"use strict";

// https://www.huoshan.com/share/hsvideo/6484059512683629837/?tag=0&tt_from=weixin&utm_source=weixin&utm_medium=huoshan_ios&utm_campaign=client_share&app=live_stream&share_ht_uid=75232140246&iid=17333970986&did=37249662976


const puppeteer = require('puppeteer');

async function parse(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()

    await page.goto(url)
    await page.waitForSelector('.player-container');

    const content = await page.evaluate(() => {
        return {
            title: document.title,
            content: '',
            imgs: [],
            video: document.querySelectorAll('.player-container')[0].getAttribute('data-src'),
            videopic: document.querySelectorAll('.poster-image')[0].src,
        }
    });

    browser.close()
    return content
}

module.exports = parse