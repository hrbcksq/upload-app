var formidable = require('formidable');
var fs = require('fs');
var os = require('os');

var tempdir = os.tmpdir();

var create = function(req) {
    var form = new formidable.IncomingForm();
    form.uploadDir = tempdir;
    form.keepExtensions = true;
    return new Promise((resolve, reject) => {
        form.parse(req, function(err, fields, files) {                        
            if (err) {
               reject(err);        
            } else 
            if (files.file.size === 0) {
               reject(new Error('File is empty')); 
            } else {
                resolve(files.file.path);
            }
        });                  
     });
}

var remove = function(path) {
    return new Promise((resolve, reject) => {
        fs.access(path, (err) => {
            if (err) {
                resolve();                    
            } else {
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve();
                    }   
                });                
            }            
        })
    });
}

module.exports = {
    'create' : create,
    'remove' : remove
}


    
    