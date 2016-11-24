var grid = require('gridfs-stream');
var mongoose = require('mongoose');
var config = require('../config');
var fs = require('fs');
// var sharp = require('sharp');

var localStorage = require('./localStorageService');

// var im = require('imagemagick-stream');
// thumb 
// var resize = im().resize('200x200').quality(90);

grid.mongo = mongoose.mongo;
var connection = mongoose.createConnection(config.databaseConnection);
var gfs = grid(connection.db);
// var gfs = grid(mongoose.connection);

// var uploadThumb = function(stream, userId, originalId) {
//     return new Promise((resolve, reject) => {                     
//             var writeStream = gfs.createWriteStream({ 
//                 metadata: {
//                     userId: userId,
//                     thumb : true,
//                     originalId: originalId.toString()
//                 }
//             });
//             stream.pipe(resize).pipe(writeStream)
//                 .on('finish', resolve)
//                 .on('error', reject);                
//         });
// }

var saveStreamToDb = function(stream, userId) {
    var writeStream = gfs.createWriteStream({
        metadata: {userId: userId},
        thumb: true
    });
    return new Promise((resolve, reject) => {
        stream.pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
    });
}

var uploadImage = function(req, userId) {
    return new Promise((resolve, reject) => { 
            localStorage.create(req)
                .then(tempFilePath => saveStreamToDb(fs.createReadStream(tempFilePath), userId)
                    .then(() => tempFilePath)
                )
                .then((tempFilePath) => localStorage.remove(tempFilePath))
                .then(resolve)
                .catch(reject)  
    });
}

var selectImages = function(userId, count, skip) {
    return new Promise((resolve, reject) => {
            gfs.files.find({
                metadata : {
                    'userId' : userId
                }                
            })
            .sort({ '_id' : -1 })
            .skip(skip)
            .limit(count)
            .toArray((err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records)
                }
            });            
    });
};

var getImage = function(id) {
    return gfs.createReadStream({_id: id});
};

module.exports = {
        // 'remove' : remove,
        'upload' : uploadImage,  
        'select' : selectImages,
        'get' : getImage    
    } 