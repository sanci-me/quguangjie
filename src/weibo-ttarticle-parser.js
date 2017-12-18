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

    await page.goto(url);
    await page.waitForSelector('.WB_editor_iframe')
        .catch(err => {
            console.error('error occured, page timeout')
            console.error(err)
            browser.close()
            process.exit()
        })

    const content = await page.evaluate(() => {
        const contentStr = document.querySelectorAll('.WB_editor_iframe')[0].innerHTML
        return {
            title: document.title,
            content: contentStr,
            video: '',
            videopic: ''
        }
    });

    browser.close()
    return content
}

module.exports = parse