"use strict";

// http://www.meipai.com/media/875369664

const puppeteer = require('puppeteer');

async function parse(url) {
    console.log('url' + url)
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage()

    await page.goto(url)

    const content = await page.evaluate(() => {
        var h = "substring"
            , i = "split"
            , j = "replace"
            , k = "substr";
        var decodeMp4 = {
            getHex: function(a) {
                return {
                    str: a[h](4),
                    hex: a[h](0, 4)[i]("").reverse().join("")
                }
            },
            getDec: function(a) {
                var b = parseInt(a, 16).toString();
                return {
                    pre: b[h](0, 2)[i](""),
                    tail: b[h](2)[i]("")
                }
            },
            substr: function(a, b) {
                var c = a[h](0, b[0])
                    , d = a[k](b[0], b[1]);
                return c + a[h](b[0])[j](d, "")
            },
            getPos: function(a, b) {
                return b[0] = a.length - b[0] - b[1],
                    b
            },
            decode: function(a) {
                var b = this.getHex(a)
                    , c = this.getDec(b.hex)
                    , d = this[k](b.str, c.pre);
                return window.atob(this[k](d, this.getPos(d, c.tail)))
            }
        };
        const contentStr = document.querySelectorAll('.detail-description')[0].innerText
        const videoSrc = decodeMp4.decode(document.querySelectorAll('#detailVideo')[0].getAttribute('data-video'))
        return {
            title: document.title.replace(/ \- .*/, ''),
            content: '<p>' + contentStr.replace(/<a\b[^>]*>(.*?)<\/a>/gi,"").replace(/^(\n)?\s+/g, '') + '</p>',
            imgs: [],
            video: videoSrc.replace(/\?.+/, '')
        }
    })

    browser.close()
    return {
        title: content.title,
        content: content.content,
        video: content.video
    }
}

module.exports = parse