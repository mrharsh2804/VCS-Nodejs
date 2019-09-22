const fs = require('fs');
var http = require('http');
const fse = require('fs-extra');
var artiId = "";
var express = require('express');
var util = require('util');
const table = require('table').table;
var app = express();


var readline = require('readline')


var path = "";
var targetpath = ""; 
var manipath = "";
var filename = "";

var csvArtID = "";
var i = 0;
var arrayList = require('array-list');
var breadcrum = [];
var lines = [];
var csvlines = ""; 
var fileDetails = [];

var date = new Date();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: false
}));

var server = app.listen(5000, function () {
	console.log('Node server is running..');
});


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/createReo.html');
	
});
// new update 04/13/19
app.post('/', function (req, res) {
	path = req.body.sourcefile;
	targetpath = req.body.targetfile;
	manifestId = req.body.ManifestId;
	manipath = req.body.manifestpath;
	var inputValue = req.body.repo;
	console.log(inputValue);
	if (inputValue.match("Create Repository")) {
		console.log("Going to createrepo()");
		test(path, targetpath, manifestId);
		
	}
	else if (inputValue == "CheckIn Repository") {
		checkInRepo();
	}
	else if (inputValue == "CheckOut Repository") {
		checkOutRepo();
	}
	res.send("backup is done successsfully");

});

//createRepo function
function createRepo1(path, targetpath, manifestId) {
	test();
	console.log("In createrepo() 1");
	try {
		console.log("In createrepo()");
		createRepoMain(path, targetpath, manifestId); // write logic for this function
	}

	catch (err) {
		return console.log(err.message);

	}

}

function test(path, targetpath, manifestId) {
	createRepoMain(path, targetpath, manifestId);
	console.log("In test");
}

//create createRepoMain function
function createRepoMain(path, tarPath, maniID) {
	lines.push("Heena\r\n");
	lines.push("ProjectBackup\r\n");
	lines.push(date + "\r\n\r\n");
	lines.push("----------------------CREATION OF REPO---------------------------\r\n");
	lines.push("Source : " + path + "\r\n");
	lines.push("Target : " + tarPath + "\r\n");
	lines.push(util.format('Artifact ID     ', 'Original file name\t\t\t', 'Source Path     ' + '\r\n'));
	dir(path);
	console.log("ManifestId" + maniID);
	writeToManifest(lines.toString().split(','), targetpath, "CreatRepo_" + maniID);
	csvFileGenr(csvlines.toString().split(';'), targetpath, "CreatRepo_" + maniID);

}


// checkin repo function
function checkInRepo() {
	try {
		checkInRepoMain(path, targetpath, manifestId);
	}

	catch (err) {
		return console.log(err.message);

	}


}


//checkInRepoMain function
function checkInRepoMain(path, tarPath, maniID) {
	lines.push("Heena\r\n");
	lines.push("ProjectBackup\r\n");
	lines.push(date + "\r\n\r\n");
	lines.push("----------------------CREATION OF REPO---------------------------\r\n");
	lines.push("Source : " + path + "\r\n");
	lines.push("Target : " + tarPath + "\r\n");
	lines.push(util.format('Atifact ID     ', 'Original file name\t\t\t', 'Source Path     ' + '\r\n'));
	dir(path);
	writeToManifest(lines.toString().split(','), targetpath, "CheckInRepo_" + maniID);
	csvFileGenr(csvlines.split(';'), targetpath, "CheckIn_" + maniID);
}


//checkOutRepo funtion

function checkOutRepo() {

	try {

		console.log("in checkout option");
		// Check-out repo here
		checkOutRepoMain(path, targetpath, manifestId);
	}

	catch {}
}

//checkOutRepoMain funcation
function checkOutRepoMain(path, tarPath, maniID) {
	lines.push("Heena\r\n");
	lines.push("ProjectBackup\r\n");
	lines.push(date + "\r\n\r\n");
	lines.push("----------------------CREATION OF REPO---------------------------\r\n");
	lines.push("Source : " + path + "\r\n");
	lines.push("Target : " + tarPath + "\r\n");
	lines.push(util.format('Atifact ID     ', 'Original file name\t\t\t', 'Source Path     ' + '\r\n'));
	readCSV(manipath); 
	writeToManifest(lines.toString().split(','), targetpath, "CheckOutRepo_" + maniID);
}

//readCSV function
function readCSV(mpath) {
	var csvFile = mpath;
	var line = "";
	var cvsSplitBy = ",";
	try {

		let rl = readline.createInterface({
			input: fs.createReadStream(csvFile)
		});


		// event is emitted after each line
		rl.on('line', function (line) {


			fileDetails = line.split(cvsSplitBy);
			csvArtID = fileDetails[0];
			fileName = fileDetails[1];
			filePath = fileDetails[3];
			console.log("before");
			console.log(filePath);
			console.log("after");
			listAllDirandSubDircheckout(filePath);
		});
	}

	catch (err) {
		return console.log(err.message);

	}
}
// dir function to get files from directories for repo
function dir(p) {

	//passsing path and callback function
	console.log("dp1 : " + p);

	fs.readdirSync(p).forEach(function (file) {
		var stat;
		console.log("" + p + "\\" + file);
		stat = fs.statSync("" + p + "\\" + file);
		breadcrum.splice(i, 0, file);
		console.log(breadcrum);
		var newTar = createTarget(targetpath, breadcrum); // error 
		console.log(newTar);
		var artiId = "";
		var ext = "";
		if (stat.isDirectory()) {
			createRepo(newTar);
			console.log("in isDir() : " + p + "\\" + breadcrum[i]);
			dir(p + "\\" + breadcrum[i++]);
			i--;
			breadcrum.splice(i, 1);
		}
		else {
			console.log("In else part");

			createRepo(newTar);
			try {
				ext = file.substring(file.lastIndexOf(".") + 1);
				console.log("" + p + "\\" + file);
				artiId = targetFileName("" + p + "\\" + file);

				console.log("reaches here");
				if (!fs.existsSync(newTar + "//" + artiId + "." + ext)) {

					if (stat.isFile()) {
						fs.copyFileSync(p + "//" + file, newTar + "//" + artiId + "." + ext);
					}
				}
				breadcrum.splice(i, 1);
				console.log(breadcrum);
			}
			catch (err) {
				return console.log(err.message);
			}

			lines.push(util.format(artiId + ext + "\t\t" + file + "\t\t\t\t" + path + "\\" + file + "\r", newTar + "\r\n"));
			console.log(artiId + ext + "," + file + "," + path + "\\" + file + "," + newTar + ";\n");
			csvlines += artiId + "." + ext + "," + file + "," + path + "\\" + file + "," + newTar + ";\n";

		}

	});

}

////get all files for checkout
//listAllDirandSubDircheckout funtion
function listAllDirandSubDircheckout(dpath) {
	console.log("dp1 : " + dpath);

	fs.readdirSync(dpath).forEach(function (file) {
		var stat;
		console.log("" + dpath + "\\" + file);
		stat = fs.statSync("" + dpath + "\\" + file);
		console.log("file name" + file);
		if (!("Activity" == file)) // stopping here
		{
			breadcrum.splice(i, 0, dpath + "\\" + file);
			console.log(breadcrum);
			var newTar = null;
			if (file.lastIndexOf(".") != -1) {
				newTar = createTargetForCheckout(targetpath, breadcrum);
				console.log("Check Out FileS Path" + newTar);
				createRepo(newTar);
			}
			if (stat.isDirectory() && file.lastIndexOf(".") != -1)

			{
				listAllDirandSubDircheckout(dpath + "\\" + breadcrum[i++])
				i--;
				breadcrum.splice(i, 1);
			}

			else if (newTar != null) {
				createRepo(newTar);
				try {
					console.log(csvArtID + "==" + file);
					if (csvArtID == file) {
						fs.copyFileSync(dpath + "\\" + file, newTar + "//" + fileName); 
						
						lines.push(util.format(csvArtID + "\t\t" + file + "\t\t\t\t" + path + "\\" + file + "\r\n"));
					}

					breadcrum.splice(i, 1);
					console.log(breadcrum);
				}
				catch (err) {
					return console.log(err.message);

				}
			}
		}
	}); // end of if 

} // end of function

//createRepo function to create repository

function createRepo(string) {
	//var fs = require('fs');
	var dirc = string;

	if (!fs.existsSync(dirc)) {
		//fs.mkdirSync(dirc);
		fse.ensureDirSync(dirc);
	}
}
String.format = function () {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i += 1) {
		var reg = new RegExp('\\{' + i + '\\}', 'gm');
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
};


//createTarget Function for create repo
function createTarget(base, breadcrum) {
	for (var i in breadcrum) {
		base += "\\" + breadcrum[i];
	}
	return base;
}

//targetFileName function for creation of Artifact id for the target file name with the calculation of check sum of the file content with given weights. 
function targetFileName(newtar) {

	let rename;
	let c;
	let asciiVal = 0;
	let j = 0;
	let checksum = 0;
	let wts = [1, 3, 7, 11, 17];
	let chars = 0;

	const contents = fs.readFileSync(newtar, 'utf8');

	for (let i = 0; i < contents.length; i++) {
		c = contents.substr(i, 1);
		asciiVal = c.charCodeAt(0);
		if (j > 4) {
			j = 0;
		}
		checksum = checksum + (wts[j++] * asciiVal);
		chars++;
	}
	return checksum + "." + chars + ".";
}


//writetoManifest for txt file
function writeToManifest(lines, tarPath, mfestCMD) {
	var manifestname = mfestCMD;
	let path = tarPath + "\\Activity";
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}

	let file = path + "\\" + manifestname + ".txt";
	if (!fs.existsSync(file)) {
		fs.createWriteStream(file);
	}

	fs.writeFile(file, lines, 'utf8', function (err) {
		if (err) {
			//return console.log(err);
		}
	});
	console.log("text file created");
}

//csvFileGenr funcation  for csv file
function csvFileGenr(lines, tarPath, mfestCMD) {
	var manifestname = mfestCMD;
	let path = tarPath + "\\Activity";
	if (!fs.existsSync(tarPath)) {
		fs.mkdirSync(tarPath);
	}
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}

	let file = path + "\\" + manifestname + ".csv";
	if (!fs.existsSync(file)) {
		fs.createWriteStream(file);
	}
 
	fs.writeFile(file, lines, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}
	});
	console.log("csv file created");
}

function createTargetForCheckout(base, breadcrum) {
	var str = "";
	var splitBase = [];
	splitbase = base.split("\\");
	str = str + breadcrum[0];
	var split = [];
	split = str.split("\\");
	console.log("split  = " + split);
	console.log("splitbase  = " + splitbase);
	for (var j = 4; j < split.length - 2; j++) {

		base += "\\" + split[j];

	}
	return base;
}