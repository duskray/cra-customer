const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api', {
        target: 'http://www.zuliao.daqian.dev.thinkbuilder.cn', 
        secure: false, 
        changeOrigin: true,
        pathRewrite: { "^/api" : "" },
    }));
};