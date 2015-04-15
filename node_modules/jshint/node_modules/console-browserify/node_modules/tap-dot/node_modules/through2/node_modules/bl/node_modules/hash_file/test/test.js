'use strict'


var os = require('os')
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var exec = require('child_process').exec

var assert = require('assert')
var async = require('async')

var hash_file = require('../hash_file.js')

var dummyfileMegs = 2

describe('hash_file module', function(){
  var filePath
  beforeEach(function(done){
    filePath = path.join(os.tmpdir(), 'hashfile-test-' + Math.random())
    console.time('generate dummy file')
    var out = fs.createWriteStream(filePath)
    for (var i = 0; i < dummyfileMegs; i++) {
      out.write(crypto.randomBytes(1024 * 1024))
    }
    out.end(function () {
      console.timeEnd('generate dummy file')
      done()
    })
  })

  afterEach(function(done) {
    fs.unlink(filePath, done)
  })

  describe('md4', function() {
    it('should generate a md4 hash without error', function(done){
      console.time('md4')
      hash_file(filePath, 'md4', function(err, hash) {
        console.timeEnd('md4')
        assert.ok(!err, err)
        assert.ok(hash)
        assert.equal(32, hash.length)
        done()
      })
    })
    it('should generate the same md4 hash multiple times for the same file', function(done) {
      hash_file(filePath, 'md4', function(err, hash_first) {
        assert.ok(!err, err)
        hash_file(filePath, 'md4', function(err, hash_second) {
          assert.ok(!err, err)
          assert.equal(hash_first, hash_second)
          done()
        })
      })
    })
    it('should generate a different hash for a modified file', function(done) {
      hash_file(filePath, 'md4', function(err, hash_first) {
        assert.ok(!err, err)
        fs.writeFile(filePath, 'md4 data', function(err) {
          assert.ok(!err, err)
          hash_file(filePath, 'md4', function(err, hash_second) {
            assert.ok(!err, err)
            assert.notEqual(hash_first, hash_second)
            done()
          })
        })
      })
    })
  })
  describe('md5', function() {
    it('should generate a md5 hash without error', function(done){
      console.time('md5')
      hash_file(filePath, 'md5', function(err, hash) {
        assert.ok(!err, err)
        assert.ok(hash)
        assert.equal(32, hash.length)
        console.timeEnd('md5')
        done()
      })
    })
    it('should generate the same md5 hash multiple times for the same file', function(done) {
      hash_file(filePath, 'md5', function(err, hash_first) {
        assert.ok(!err, err)
        console.time('md5')
        hash_file(filePath, 'md5', function(err, hash_second) {
          console.timeEnd('md5')
          assert.ok(!err, err)
          assert.equal(hash_first, hash_second)
          done()
        })
      })
    })
    it('should generate a different hash for a modified file', function(done) {
      hash_file(filePath, 'md5', function(err, hash_first) {
        assert.ok(!err, err)
        fs.writeFile(filePath, 'md5 data', function(err) {
          assert.ok(!err, err)
          hash_file(filePath, 'md5', function(err, hash_second) {
            assert.ok(!err, err)
            assert.notEqual(hash_first, hash_second)
            done()
          })
        })
      })
    })
  })
  describe('sha1', function() {
    it('should generate a sha1 hash without error', function(done){
      console.time('sha1')
      hash_file(filePath, 'sha1', function(err, hash) {
        console.timeEnd('sha1')
        assert.ok(!err, err)
        assert.ok(hash)
        assert.equal(40, hash.length)
        done()
      })
    })
    it('should generate the same sha1 hash multiple times for the same file', function(done) {
      hash_file(filePath, 'sha1', function(err, hash_first) {
        assert.ok(!err, err)
        hash_file(filePath, 'sha1', function(err, hash_second) {
          assert.ok(!err, err)
          assert.equal(hash_first, hash_second)
          done()
        })
      })
    })
    it('should generate a different hash for a modified file', function(done) {
      hash_file(filePath, 'sha1', function(err, hash_first) {
        assert.ok(!err, err)
        fs.writeFile(filePath, 'sha1 data', function(err) {
          assert.ok(!err, err)
          hash_file(filePath, 'sha1', function(err, hash_second) {
            assert.ok(!err, err)
            assert.notEqual(hash_first, hash_second)
            done()
          })
        })
      })
    })
  })
  describe('sha256', function() {
    it('should generate a sha256 hash without error', function(done){
      console.time('sha256')
      hash_file(filePath, 'sha256', function(err, hash) {
        console.timeEnd('sha256')
        assert.ok(!err, err)
        assert.ok(hash)
        assert.equal(64, hash.length)
        done()
      })
    })
    it('should generate the same sha256 hash multiple times for the same file', function(done) {
      hash_file(filePath, 'sha256', function(err, hash_first) {
        assert.ok(!err, err)
        hash_file(filePath, 'sha256', function(err, hash_second) {
          assert.ok(!err, err)
          assert.equal(hash_first, hash_second)
          done()
        })
      })
    })
    it('should generate a different hash for a modified file', function(done) {
      hash_file(filePath, 'sha256', function(err, hash_first) {
        assert.ok(!err, err)
        fs.writeFile(filePath, 'sha256 data', function() {
          assert.ok(!err, err)
          hash_file(filePath, 'sha256', function(err, hash_second) {
            assert.ok(!err, err)
            assert.notEqual(hash_first, hash_second)
            done()
          })
        })
      })
    })
  })
  it('should generate an error if trying to read a  non-existant file', function(done) {
    hash_file('garbagepathyeahman', 'sha256', function(err, hash_first) {
      assert.ok(err)
      done()
    })
  })
  it('should generate an error if trying to use a non-existant hash method', function(done) {
    hash_file(filePath, 'garbage', function(err, hash_first) {
      assert.ok(err)
      done()
    })
  })

  describe('hash a buffer', function() {
    it('should generate a md5 hash on a buffer object', function(done){
      console.time('md4')
      var blob = new Buffer(Array.apply(null, Array(1024 * 10)).map(
            function () { return 'aaaaaaaaaa' }).join('')),
          expectedMd5 = '302d3a0c8e319eaa95b059b346de1d1d'

      var ret = hash_file(blob, 'md5', function(err, hash) {
        console.timeEnd('md5')
        assert.ok(!err, err)
        assert.ok(hash)
        assert.equal(expectedMd5, hash)
        // use next tick so we can compare the return value
        // of the hash_file call.
        process.nextTick(function () {
          assert.equal(expectedMd5, ret) // also available on the return, cause we can
          done()
        })
      })
    })
  })
})
