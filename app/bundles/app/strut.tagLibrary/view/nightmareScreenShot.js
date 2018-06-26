// Usage : node nightmareScreenShot.js tempFilename previewConfig url1 url2 imagePath
const args = process.argv;
console.log("Printing Arguments : ");
console.log(args);
let tempFilename = args[2];
let previewConfig = args[3];
let url1 = args[4];
let url2 = args[5];
let imagePath = args[6];
const fs = require('fs');
let previewString = fs.readFileSync(tempFilename, 'utf8');
// console.log(previewString);
const Nightmare = require('nightmare');
let nightmare = Nightmare(
{
	electronPath: require('electron'),
	width: 1024,
	height: 768,
	show: false,
	gotoTimeout: 1200000,
	switches:
	{
		'ignore-certificate-errors': true
	}
});
nightmare
	.goto(url1)
	.evaluate(function(previewString, previewConfig)
	{
		localStorage.setItem('preview-string', previewString);
		localStorage.setItem('preview-config', previewConfig);
	}, previewString, previewConfig)
	.refresh()
	.goto(url2)
	.evaluate(function()
	{
		document.querySelector(".hint").remove();
	})
	.screenshot(imagePath)
	.end()
	.catch(error => console.error(error));
fs.unlinkSync(tempFilename);