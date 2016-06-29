/**
 * FileController
 *
 * @description :: Server-side logic for managing file uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var fs = require('fs-extra')

// Source: http://weeknumber.net/how-to/javascript 
// Returns the ISO week of the date.
var getWeek = function(dt) {
    var date = new Date(dt.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

module.exports = {

    /**
    * Handle incoming file upload.
    */
    upload: function(req, res) {
        var dt = new Date();

        sails.log.info('[FileController] [' + dt.toString() + '] upload req client=' + 
            req.clientip+', version=' + req.params.version + 
            ', deviceid=' + req.params.deviceid + 
            ', filename=' + req.params.filename);

        var dstdir = sails.config.upload.datadir + '/' + 
            req.params.deviceid + '/' + 
            dt.getFullYear() + '/' + 
            getWeek(dt) + '/';

        sails.log.verbose("[FileController] ensure dir " + dstdir);

        fs.ensureDir(dstdir, function(err) {
            if (err) {
                sails.log.error(err);
                return res.serverError();
            }

            var dstfile = dstdir + req.params.filename;
            sails.log.verbose("[FileController] start writing " + dstfile);

            var pipe = req.pipe(fs.createWriteStream(dstfile)); 

            pipe.on('error', function(err) {
                sails.log.error(err);
                return res.serverError();
            });

            pipe.on('finish', function() {
                fs.stat(dstfile, function(err, stats) {
                    if (err || !stats.isFile()) {
                        sails.log.error("[FileController] failed to create " + 
                                        dstfile);
                        if (err) sails.log.error(err);
                        return res.serverError();
  
                    } else if (stats['size'] != req.headers['content-length']) {
                        // missing bytes
                        sails.log.debug("[FileController] failed to write " + 
                            dstfile + ", wrote " + stats['size'] + " bytes " +
                            " got " + req.headers['content-length'] + " bytes");

                        fs.unlink(dstfile);
                        return res.serverError();

                    } else {
                        // all good
                        sails.log.verbose("[FileController] wrote " + stats['size'] + 
                                          " bytes to " + dstfile);
                        return res.ok();
                    } 
                }); // fstat
            }); // onFinish
        }); // ensureDir
    } // upload
};
