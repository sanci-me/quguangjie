"use strict";

const request = require('request')
const key = process.env.quguangjie_apiKey
const getUrl =  process.env.quguangjie_getUrl + key
const saveUrl = process.env.quguangjie_saveUrl

module.exports = {
    getList () {
        return new Promise((resolve, reject) => {
            request({
                url: getUrl,
                json: true
            }, function (error, httpResponse, body) {
                resolve(body)
            })
        })
    },
    save (data) {
        return new Promise((resolve, reject) => {
            request({
                url: saveUrl,
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