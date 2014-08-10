try {

  var fs = require("fs"),
    	path = require("path"),

			/*===== CONFIGURATION =====*/
			dropboxUserID = "YOUR_USER_ID",
			obfuscatedFolder = "s",
			/*===== END CONFIGURATION =====*/

			dropboxUrl = "https://dl.dropboxusercontent.com/u/" + dropboxUserID + "/" + obfuscatedFolder + "/",
	    fullPath = "{query}",
	    dir = path.dirname(fullPath),
	    img = path.basename(fullPath),
	    ext = img.match(/\.[a-z]{3,4}$/i),
	    shareDir = dir.replace(/Public\/(.*)$/, "Public/" + obfuscatedFolder),
	    map;

  fs.readFile(shareDir + "/map.json", "utf8", function(err, mapStr) {
    if (err) throw err;

    map = JSON.parse(mapStr);

    if (map[img]) {
      readFromMap();
    } else {
      addToMap();
    }

  });

  function addToMap() {
    var obfuscated = new Date().getTime() + ext;

    map[img] = obfuscated;

    // Copy the file to the obfuscated folder
    fs.createReadStream(fullPath).pipe(fs.createWriteStream(shareDir + "/" + obfuscated));
    fs.writeFile(shareDir + "/map.json", JSON.stringify(map), function(err) {
      if (err) throw err;

      readFromMap();
    });
  }

  function readFromMap() {
    console.log(dropboxUrl + map[img]);
  }

} catch (e) { console.log(e.message); }
