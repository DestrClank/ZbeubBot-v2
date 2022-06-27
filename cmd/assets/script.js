import values from "../values.json" assert {type: "json"};

document.getElementById("crumbs").innerText = `Zbeub Bot ${values.version.versionNumber}`
document.getElementById("footer_title").innerText = `Zbeub Bot ${values.version.versionNumber}`
document.getElementById("title").innerText = `Zbeub Bot ${values.version.versionNumber}`