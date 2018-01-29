/* global describe it sails */

const request = require('supertest')
const fs = require('fs')
const assert = require('chai').assert

const rmdir = function (path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    files.forEach(function (file, index) {
      const curPath = path + '/' + file

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        rmdir(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })

    fs.rmdirSync(path)
  }
}

describe('FileController', function () {
  describe('get /foo', function () {
    it('should return 404', function (done) {
      request(sails.hooks.http.app)
        .get('/foo')
        .expect(404, done)
    })
  })

  describe('#update()', function () {
    it('should return 200 on upload', function (done) {
      // check file size
      fs.stat('test/1468852623282_stats.db.zip', function (err, stats) {
        if (err) return done(err)

        // upload req
        const req = request(sails.hooks.http.app)
          .post('/1234/5678/1468852623282_stats.db.zip')
          .set('Content-Type', 'application/json')
          .set('Content-Length', stats['size'])

        const stream = fs.createReadStream('test/1468852623282_stats.db.zip')
        stream.pipe(req)

        stream.on('end', function () {
          req.expect(200)
          req.end(function (err, res) {
            if (err) return done(err)

            rmdir('test/tmp')
            done()
          })
        })
      })
    })
  })

  describe('upload json', function () {
    it('should return 200 on upload', function (done) {
      // check file size
      const json = '{"foo":"bar"}'

      // upload req /:version/:deviceid/:filename
      const req = request(sails.hooks.http.app)
        .post('/1234/5678/1468852623282_adapterid_type.json')
        .set('Content-Type', 'application/json')
        .send(json)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)

          fs.readFile('test/tmp/5678/1234/2016/29/1468852623282_adapterid_type.json', 'utf8', function (err, content) {
            assert.equal(content, json)

            rmdir('test/tmp')
            done()
          })
        })
    })
  })
})
