var superagent = require('superagent');
var expect = require('chai').expect;
var assert = require('chai').assert;

// Status API
describe('Ping API home', function(){
	var port = 4000;
	var hostAPI = 'localhost';

  it('should respond to GET',function(done){
    superagent
      .get('http://' + hostAPI + ':' + port)
      .end(function(res){
        expect(res.status).to.equal(200);
    })
    done();
  })
});

// HTML Parser
describe('Parse json [in cache] to get newestreferencetime', function(){
	
	var parser = require('../cron/helper/meteofParser');

	it('should return a "moment"', function(done) {
		var targethost = "https://donneespubliques.meteofrance.fr/",
			targetpath = "?fond=produit&id_produit=131&id_rubrique=51";

		var reftime = parser.reftimejson('donneespubliques.meteofrance.fr',
			'/donnees_libres/Static/CacheDCPC_NWP.json','0.01','AROME','SP1','00H',
			function(str) {
				console.log(str);
				assert.match(str, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/, 
			'reftime sounds like a "moment"');
			});
		done();
	})
});

// URL construction
describe('Construct URL to download data', function(){
	var parser = require('../cron/helper/meteofParser');

	it('should return the url to access to download the data', function(done) {

		done();
	});
});
