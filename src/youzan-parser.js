"use strict";

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

    const content = await page.evaluate(() => {
        const contentNode = document.getElementById('js_content')
        return {
            title: document.title,
            content: contentNode.innerHTML,
            video: ''
        }
    });

    browser.close()
    return content
}

module.exports = parse