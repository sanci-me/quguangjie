"use strict";

const request = require('request')
const key = '$()_FOR_cchao_**'

module.exports = {
    getList () {
        return new Promise((resolve, reject) => {
            request({
                url: 'https://pailekeji.com/inrouter/article/list?offset=0&key=' + key,
                json: true
            }, function (error, httpResponse, body) {
                resolve(body)
            })
        })
    },
    getSourceUrl (articleId) {
        return new Promise((resolve, reject) => {
            request.post({
                url: 'https://pailekeji.com/article/detailapi',
                json: true,
                form: {
                    token: 'MjE3NDM3JDEzNTI3NDcyNTQwXzdmZDc4ZDYyYTE3ZGZhZTdhNWJkYjM0YjE4NWFkYmZm',
                    id: articleId
                }
            }, function (error, httpResponse, body) {
                if (error) {
                    reject(error)
                } else {
                    resolve(body.data.sourceurl)
                }
            })
        })
    },
    save (data) {
        return new Promise((resolve, reject) => {
            request({
                url: 'https://pailekeji.com/inrouter/article/save',
                method: 'POST',
                json: true,
                form: {
                    key,
                    ...data
                }
            }, function (error, httpResponse, body) {
                if (error) {
                    reject(error)
                } else {
                    resolve(body)
                }
            })
        })
    }
}