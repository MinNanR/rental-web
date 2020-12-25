const webpack = require('webpack')

module.exports = {
    configureWebpack:{
        plugins:[
            new webpack.ProvidePlugin({
                "window.Quill":'quill',
            })
        ]
    },
    devServer:{
        port:3000
    },
    publicPath: './',
    assetsDir:'.'
}

