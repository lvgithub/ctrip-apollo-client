const axios = require('axios')

// axios.interceptors.response.use(function (response) {
//     return response
// }, function (error) {
//     // console.log('error1111111111111111111111111', error)
//     // if (error.response && +error.response.status === 304) {
//     //     return Promise.reject(new Error('304'))
//     // }
//     return Promise.reject(error)
// })

exports.axios = axios.default
