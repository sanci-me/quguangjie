"use strict";

const weiboParser = require('./src/weibo-parser')
const weiboMobileParser = require('./src/weibo-m-parser')
const wechatParser = require('./src/wechat-parser')
const huajuanParser = require('./src/huajuan-parser')
const miaopaiParser = require('./src/miaoppai-parser')
const ygParser = require('./src/365yg-parser')
const meipaiParser = require('./src/meipai-parser')
const huoshanParser = require('./src/huoshan-parser')
const tmallParser = require('./src/tmall-parser')
const youzanParser = require('./src/youzan-parser')
const toutiaoParser = require('./src/toutiao-parser')
const weiboTTArticleParser = require('./src/weibo-ttarticle-parser')
const api = require('./api-new')

function getParser (url) {
    if (url.indexOf('https://detail.tmall.com') >= 0) {
        return tmallParser(url)
    }
    if (url.indexOf('weibo.com/ttarticle/') > 0) {
        return weiboTTArticleParser(url)
    }
    if (url.indexOf('https://weibo.com/') >= 0 || url.indexOf('http://weibo.com/') >= 0) {
        return weiboParser(url)
    }
    if (url.indexOf('http://m.huajuanmall.com') >= 0) {
        return huajuanParser(url)
    }
    if (url.indexOf('http://www.miaopai.com') >= 0) {
        return miaopaiParser(url)
    }
    if (url.indexOf('//mp.weixin.qq.com') >= 0) {
        return wechatParser(url)
    }
    if (url.indexOf('https://www.365yg.com/') >= 0) {
        return ygParser(url)
    }
    if (url.indexOf('http://www.meipai.com/') >= 0) {
        return meipaiParser(url)
    }
    if (url.indexOf('https://www.huoshan.com/') >= 0) {
        return huoshanParser(url)
    }
    if (url.indexOf('https://m.weibo.cn') >= 0) {
        return weiboMobileParser(url)
    }
    if (url.indexOf('https://h5.youzan.com/') >= 0) {
        return youzanParser(url)
    }
    if (url.indexOf('www.toutiao.com') >= 0) {
        return toutiaoParser(url)
    }
    console.error('unexpected article url , url is ' + url)
}

async function parse (url) {
    return await getParser(url)
}

let processList = []

async function loadData () {
    const rs = await api.getList()
    processList = rs.data || []
}

async function saveData (data) {
    return await api.save(data)
}

async function run () {
    const data = processList.shift()
    if (!data) {
        console.info('[schedule] start to load data from api')
        await loadData()
    } else {
        const url = data.sourceurl
        console.info('[schedule] start to parse url ' + url + ', article id = ' + data.articleID)
        try {
            const rs = await parse(url)
            console.info('[schedule] end to parse url ' + url)
            console.info('[schedule] start to save data')
            console.log(rs)
            const saveRs = await saveData({
                articleid: data.articleID,
                content: rs.content,
                videourl: rs.video,
                videopic: rs.videopic,
                title: rs.title,
                author: rs.author
            })
            console.log(saveRs)
            console.info('[schedule] save data successfully, article id = ' + data.articleID)
        } catch (e) {
            console.error('[schedule] ERROR! Parse url ' + url + ', article id = ' + data.articleID)
            console.error(e)
        }
    }
    console.info('[schedule] schedule to next url ')
    setTimeout(run, 5e3)
}

run()