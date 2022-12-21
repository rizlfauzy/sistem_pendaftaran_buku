const path = require('path');

var utils = {};

utils.isFormat = (originalName, ...ext) => {
    return ext.some((format) => path.extname(originalName).toLowerCase().includes(format));
}

export default utils;