var api = require('./local-api'),
    notify = require('./notify');

var local = {
    save: function(filename, code, desc, image) {
        api.challenge.local.save({
            filename: filename,
            code: code,
            description: desc,
            image: image
        })
        .then(notify.success, notify.failure);
    },
    saveWallpaper: function(filename, image_1024, image_4_3, image_16_9) {
        api.challenge.local.saveWallpaper({
            filename: filename,
            image_1024: image_1024,
            image_4_3: image_4_3,
            image_16_9: image_16_9
        })
        .then(notify.success, notify.failure);
    }
};

var web = {
    share: function(filename, code, desc, image) {
        api.challenge.web.share({
            filename: filename,
            code: code,
            description: desc,
            image: image
        })
        .then(notify.success, notify.failure);
    },
    load: function(cb) {
        api.challenge.web.load()
        .then(function (res) {
            cb(res.body);
        }, notify.failure);
    }
};


module.exports = {
    local : local,
    web   : web
};