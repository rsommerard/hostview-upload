var request = require('supertest');
var assert = require('chai').assert;
var fs = require('fs');

describe('FileController', function() {

    describe('get /foo', function() {
        it('should return 404', function(done) {
            request(sails.hooks.http.app)
                .get('/foo')
                .expect(404, done);
        });
    });

    describe('#update()', function() {
        it('should return 200 on upload', function(done) {
            // check file size
            fs.stat('/app/test/foo.txt', function(err, stats) {
                if (err) return done(err);

                // upload req
                var req = request(sails.hooks.http.app)
                    .post('/1234/5678/foo.txt')
                    .set('Content-Type', 'application/json')
                    .set('Content-Length', stats['size']);

                var stream = fs.createReadStream('/app/test/foo.txt');
                stream.pipe(req);

                stream.on('end', function() {
                    req.expect(200);
                    req.end(function(err, res) {
                        if (err) return done(err);
                        done();
                    });                
                });
            });
        });
    });
});