function tokenextraction(targethost,targetproduct,callback) {
	var htmlparser = require("htmlparser2"),
		https = require('https'),
		domutils = require('domutils');

	// request options
	var options = {
	  hostname: targethost,
	  port: 443,
	  path: targetproduct,
	  method: 'GET',
	  agent: false
	}

	// fetch some HTML...
	var req = https.request(options, (res) => {
  	
  	res.setEncoding('utf8');
  	var body = '';
		var token = '';  	

  	res.on('data', (chunk) => {
    	body = body + chunk;
  	});

  	res.on('end', (token) => {
    	// now we have the whole body, parse it and select the nodes we want...
    	var handler = new htmlparser.DomHandler(function(err, dom) {

    		if (err) {
    			console.error("Error while parsing: " + err);
        } else {
        	var inputfield = domutils.findOne(function (dom) {
        		return (domutils.getName(dom) == "input" && domutils.hasAttrib(dom,'name') &&
        		 domutils.getAttributeValue(dom,'name') === "token");
        	},dom);
        	
        	token = inputfield.attribs.value;
        	callback(token);
        }
    	});

			var parser = new htmlparser.Parser(handler);
			parser.parseComplete(body);
  	})

	});
	req.end();

	// in case of error
	req.on('error', (e) => {
	  console.error(e);
	});
}

function urlqueryconstruction(targethost,targetproduct,grid,model,codePack,echeance,reftime,callback) {
	tokenextraction(targethost,targetproduct,function (token) {

		var escapedreferencetime = reftime.replace(/:/g,'%3A');
		var querystring = "?fond=donnee_libre&token=" + token + "&model=" + model + "&grid=" + grid + "&package=" + codePack + "&time=" + echeance + "&referencetime=" + escapedreferencetime;

		callback(querystring);
	});
}


function reftimejson(targethost,targetJSON,grid,model,codePack,echeance,callback) {
	var request = require('request'),
		moment = require('moment-timezone');

	var url = "https://" + targethost + targetJSON;
	
	request({
    url: url,
    json: true
	}, function (error, response, body) {
		var newesttime = moment('1970-01-01T00:00:00Z','YYYY-MM-DDThh:mm:ssZ');

		if (error) {
			console.error(error);
		} else if (response.statusCode === 200) {
    	//let's go through the json to retrieve the newest date
    	for (entry in body) {
    		if (body[entry].modele === model && body[entry].grille === grid) {
    			var refPacks = body[entry].refPacks;
    			for (entry in refPacks) {
    				if (refPacks[entry].codePack === codePack) {
    					var groupEcheances = refPacks[entry].refGrpEchs;
    					groupEcheances.forEach( function (value, index, array) {
    						if (groupEcheances[index].echeance === echeance) {
    							for (timeindex in groupEcheances[index].refReseauxDispos) {
    								var reftimestring = groupEcheances[index].refReseauxDispos[timeindex];
    								var reftime = moment(reftimestring,'YYYY-MM-DDThh:mm:ssZ');
    								if (reftime > newesttime) newesttime = reftime;
    							}
    						}
    					});
    				}
    			}
    		}
    	}
    	var str = newesttime.tz('UTC').format('YYYY-MM-DDThh:mm:ss');
    	return callback(str);
    }
	});
}

// download data into target link
function downloaddata(targeturl,destination,callback) { 
	const https = require('https');
	const fs = require('fs');

  var file = fs.createWriteStream(destination);

  https.get(targeturl, (res) => {
    res.pipe(file);
    file.on('finish', function() {
      file.close(callback);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(destination); // Delete the file async. (But we don't check the result)
    if (callback) {callback(err.message);} else {console.error(err.message);}
  });
};

var targethost = 'donneespubliques.meteofrance.fr';
var targetJSON = '/donnees_libres/Static/CacheDCPC_NWP.json';
var targetproduct = '/?fond=produit&id_produit=131&id_rubrique=51';
var grid = '0.01';
var model = 'AROME';
var codepack = 'SP1';
var echeance = '00H';


reftimejson(targethost, targetJSON, grid, model, codepack, echeance, function (reftime){
	console.log(reftime);
	
	// retrieve querystring info
	urlqueryconstruction(targethost, targetproduct, grid, model, codepack, echeance, reftime, function (querystring) {
		console.log(querystring);
		var url = "https://" + targethost + "/" + querystring;
		
		console.log(url);
		downloaddata(url,require('path').resolve(__dirname, 'tmp-dl','TMP.grib2'));

		console.log("That's all folks!");
	});
});




 