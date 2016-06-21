const http = require('http');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const cheerio = require('cheerio');
const fs = require('fs');

var cfg_casterURL;
var cfg_filePrefix;
var cfg_interval;
var parameterSet = 0;

function checkParameters(){
	if((parameterSet+1)!=4){
		if(process.argv.length==2){
			switch(parameterSet){
				case 0:
				rl.question("Enter a Caster.fm URL you would like to monitor: ", function(answer){
					cfg_casterURL = answer;
					parameterSet++;
					checkParameters();
				});
				break;
				case 1:
				rl.question("Enter records filename prefix: ", function(answer){
					cfg_filePrefix = answer;
					parameterSet++;
					checkParameters();
				});
				break;
				case 2:
				rl.question("Enter monitor interval (in miliseconds): ", function(answer){
					cfg_interval = answer;
					parameterSet++;
					checkParameters();
				});
				break;
			}
		}else{
			if(process.argv.length>2 && parameterSet==0){
				cfg_casterURL = process.argv[2];
				parameterSet++;
				if(process.argv.length>3){
					cfg_filPrefix = process.argv[3];
					parameterSet++;
				}
				if(process.argv.length>4){
					cfg_interval = process.argv[4];
					parameterSet++;
					checkParameters();
				}
			}
			if(parameterSet==1){
				rl.question("Enter records filename prefix: ", function(answer){
					cfg_filePrefix = answer;
					parameterSet++;
					checkParameters();
				});
			}
			if(parameterSet==2){
				rl.question("Enter monitor interval (in miliseconds): ", function(answer){
					cfg_interval = answer;
					parameterSet++;
					checkParameters();
				});
			}
		}
	}else{
		routine();
	}
}

function routine(){
	var casterSite="";
	var casterLink="";
	http.get(cfg_casterURL, function(response){
		response.on('data', function(d){casterSite+=d;});
		response.on('end', function(){
			var casterSiteJS = cheerio.load(casterSite);
			if(casterSiteJS("#players_links_real>div>input[type='text']").html()!=null){
				casterLink=casterSiteJS("#players_links_real>div>input[type='text']").val();
				var filed=0;
				var existingFiles=[];
				try{
				var request = http.get(casterLink, function(response) {
					if(filed==0){
						console.log("Connected");
						fs.readdirSync(".").forEach(function(fitem, findex){
							if(fitem.search(cfg_filePrefix)!=-1){
								existingFiles.push(fitem);
							}
						});
						if(existingFiles.length>0){
							existingFiles.sort();
							var file = fs.createWriteStream(cfg_filePrefix+"."+(parseInt(existingFiles[existingFiles.length-1].replace(cfg_filePrefix+".","").replace(".mp3",""))+1)+".mp3");
						}else{
							var file = fs.createWriteStream(cfg_filePrefix+".0.mp3");
						}
						filed=1;
					}
					response.on('end', function(){
						console.log("Connection ended, retrying again in "+cfg_interval+" ms");
						setTimeout(routine, cfg_interval);						
					});
					response.pipe(file);
				});}catch(e){
					console.log("Connection ended, retrying again in "+cfg_interval+" ms");
					setTimeout(routine, cfg_interval);
				}
			}else{
				console.log("No radio, retrying again in "+cfg_interval+" ms");
				setTimeout(routine, cfg_interval);
			}
		});
	});
}

checkParameters();