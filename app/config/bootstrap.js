/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
module.exports.bootstrap = function (cb) {
  // make sure the upload data directory exists
  sails.log.verbose('Boostrap ensure dir: ' + sails.config.upload.datadir)
  require('fs-extra').ensureDir(sails.config.upload.datadir, function (err) {
    if (err) sails.log.error(err)
    cb()
  })
}
