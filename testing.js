/*
script: `
	localStorage.setItem('preview-string', ` + xyz + `);
	localStorage.setItem('preview-config', ` + config + `);`,
	delay: 10
*/
/*
let webshot = require('node-webshot');
webshot('file:///D:/Strut_ElectronApp/Strut/app/preview_export/impress2.html#/step-1', 'node.png', function(err){
	console.dir(err);
});

const fs = require('fs');
const screenshot = require('screenshot-stream');
const screenStream1 = screenshot('http://google.com', '1024x768', {crop: false});
screenStream1.pipe(fs.createWriteStream('google.com-1024x768.png'));

let str = `<style type="text/css">

</style>
<style>
</style>
<style>
</style><!-- This is a work around / hack to get the user's browser to download the fonts 
 if they decide to save the presentation. -->
<div style="visibility: hidden; width: 0px; height: 0px">
<img src="css/Lato-Bold.woff" />
<img src="css/HammersmithOne.woff" />
<img src="css/Droid-Sans-Mono.woff" />
<img src="css/Gorditas-Regular.woff" />
<img src="css/FredokaOne-Regular.woff" />
<img src="css/Ubuntu.woff" />
<img src="css/Ubuntu-Bold.woff" />
<img src="css/PressStart2P-Regular.woff" />
<img src="css/Lato-BoldItalic.woff" />
<img src="css/AbrilFatface-Regular.woff" />
<img src="css/Lato-Regular.woff" />
</div>

<div class="fallback-message">
    <p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>
    <p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>
</div>

<div class="bg  strut-surface">
<div class="bg innerBg">
<div id="impress">
			<div class="step" data-state="strut-slide-0" data-x="2457.6" data-y="2764.8"      data-scale="3">
			<div class="bg-default slideContainer strut-slide-0" style="width: 1024px; height: 768px;">
			<div class="themedArea">
			
			</div>
			<div class="componentContainer " style="top: 29px; left: 29px; -webkit-transform:   ; -moz-transform:   ; transform:   ; width: NaNpx; height: NaNpx;">
<div class="transformContainer" style="-webkit-transform: scale(1, 1);
-moz-transform: scale(1, 1);
transform: scale(1, 1)"><div style="font-size: 36px;" class="antialias">
In botany, a fruit is the seed-bearing structure in <br>flowering plants (also known as angiosperms) <br>formed from the ovary after flowering.<br>
</div>
</div>
</div>
			</div>
		</div>
			<div class="step" data-state="strut-slide-1" data-x="6280.533333333334" data-y="2764.8"      data-scale="3">
			<div class="bg-default slideContainer strut-slide-1" style="width: 1024px; height: 768px;">
			<div class="themedArea">
			
			</div>
			<div class="componentContainer " style="top: 21px; left: 19px; -webkit-transform:   ; -moz-transform:   ; transform:   ; width: NaNpx; height: NaNpx;">
<div class="transformContainer" style="-webkit-transform: scale(1, 1);
-moz-transform: scale(1, 1);
transform: scale(1, 1)"><div style="font-size: 36px;" class="antialias">
Fruits are the means by which angiosperms disseminate seeds.<br>&nbsp;Edible fruits, in particular, have propagated with the <br>movements of humans and animals in a symbiotic relationship <br>as a means for seed dispersal and nutrition;<br>in fact, humans and many animals have become dependent <br>on fruits as a source of food.<br><br>[1] Accordingly, fruits account for a substantial fraction of the <br>world's agricultural output, and some <br>(such as the apple and the pomegranate) have acquired <br>extensive cultural and symbolic meanings.<br>
</div>
</div>
</div>
			</div>
		</div>
			<div class="step" data-state="strut-slide-2" data-x="10103.466666666667" data-y="2764.8"      data-scale="3">
			<div class="bg-default slideContainer strut-slide-2" style="width: 1024px; height: 768px;">
			<div class="themedArea">
			
			</div>
			<div class="componentContainer " style="top: 22px; left: 27px; -webkit-transform:   ; -moz-transform:   ; transform:   ; width: NaNpx; height: NaNpx;">
<div class="transformContainer" style="-webkit-transform: scale(1, 1);
-moz-transform: scale(1, 1);
transform: scale(1, 1)"><div style="font-size: 36px;" class="antialias">
In common language usage, "fruit" normally means the <br>fleshy seed-associated structures of a plant that are sweet or <br>sour, and edible in the raw state, such as <br>apples, bananas, grapes, lemons, oranges, and strawberries.<br><br>On the other hand, in botanical usage, "fruit" includes many <br>structures that are not commonly called "fruits", such as bean <br>pods, corn kernels, tomatoes, and wheat grains.<br><br>The section of a fungus that produces spores is also called <br>a fruiting body.<br>
</div>
</div>
</div>
			</div>
		</div>
	<div id="overview" class="step" data-state="strut-slide-overview" data-x="6280.533333333334" data-y="2764.8" data-scale="9"></div>
</div>
<div class="hint">
    <p>Use a spacebar or arrow keys to navigate</p>
</div>
</div>
</div>`;

let xyz = `
<style type="text/css"></style><style></style><style></style><!-- This is a work around / hack to get the user's browser to download the fonts  if they decide to save the presentation. --><div style="visibility: hidden; width: 0px; height: 0px"><img src="css/Lato-Bold.woff" /><img src="css/HammersmithOne.woff" /><img src="css/Droid-Sans-Mono.woff" /><img src="css/Gorditas-Regular.woff" /><img src="css/FredokaOne-Regular.woff" /><img src="css/Ubuntu.woff" /><img src="css/Ubuntu-Bold.woff" /><img src="css/PressStart2P-Regular.woff" /><img src="css/Lato-BoldItalic.woff" /><img src="css/AbrilFatface-Regular.woff" /><img src="css/Lato-Regular.woff" /></div><div class="fallback-message">    <p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>    <p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p></div><div class="bg  strut-surface"><div class="bg innerBg"><div id="impress">			<div class="step" data-state="strut-slide-0" data-x="2457.6" data-y="2764.8"      data-scale="3">			<div class="bg-default slideContainer strut-slide-0" style="width: 1024px; height: 768px;">			<div class="themedArea">						</div>			<div class="componentContainer " style="top: 256px; left: 341.33px; -webkit-transform:   ; -moz-transform:   ; transform:   ; width: NaNpx; height: NaNpx;"><div class="transformContainer" style="-webkit-transform: scale(1, 1);-moz-transform: scale(1, 1);transform: scale(1, 1)"><div style="font-size: 72px;" class="antialias"><font>Text</font></div></div></div>			</div>		</div>	<div id="overview" class="step" data-state="strut-slide-overview" data-x="2457.6" data-y="2764.8" data-scale="9"></div></div><div class="hint">    <p>Use a spacebar or arrow keys to navigate</p></div></div></div>
`;

let config = "{}";
let screenStream2 = screenshot('file:///D:/Strut_ElectronApp/Strut/app/preview_export/impress2.html#/step-1', '1024x768',
{
	crop: false,
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
	delay: 5,
	options: {
			settings : { javascriptEnabled : true }
		}
});
screenStream2.pipe(fs.createWriteStream('try.png'));
*/


// const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: true });
// nightmare.goto('file://D:/Strut_ElectronApp/Strut/app/preview_export/impress2.html');
// nightmare.screenshot('nightmare.png');
console.log(__dirname);
let path = require('path');
let url = 'file://' + path.join(__dirname , 'app' , 'preview_export' , 'impress2.html');
let imagePath = path.join(__dirname , 'nightmare.png');
console.log(url);
console.log(imagePath);
const Nightmare = require('nightmare')
let nightmare = Nightmare({electronPath: require('electron'), width: 1024, height: 768});
	nightmare
    .goto(url)
	.evaluate(function()
	{
		let str = `<style type="text/css"></style><style></style><style></style><!-- This is a work around / hack to get the user's browser to download the fonts  if they decide to save the presentation. --><div style="visibility: hidden; width: 0px; height: 0px"><img src="css/Lato-Bold.woff" /><img src="css/HammersmithOne.woff" /><img src="css/Droid-Sans-Mono.woff" /><img src="css/Gorditas-Regular.woff" /><img src="css/FredokaOne-Regular.woff" /><img src="css/Ubuntu.woff" /><img src="css/Ubuntu-Bold.woff" /><img src="css/PressStart2P-Regular.woff" /><img src="css/Lato-BoldItalic.woff" /><img src="css/AbrilFatface-Regular.woff" /><img src="css/Lato-Regular.woff" /></div><div class="fallback-message">    <p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>    <p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p></div><div class="bg  strut-surface"><div class="bg innerBg"><div id="impress">			<div class="step" data-state="strut-slide-0" data-x="2457.6" data-y="2764.8"      data-scale="3">			<div class="bg-default slideContainer strut-slide-0" style="width: 1024px; height: 768px;">			<div class="themedArea">						</div>			<div class="componentContainer " style="top: 256px; left: 341.33px; -webkit-transform:   ; -moz-transform:   ; transform:   ; width: NaNpx; height: NaNpx;"><div class="transformContainer" style="-webkit-transform: scale(1, 1);-moz-transform: scale(1, 1);transform: scale(1, 1)"><div style="font-size: 72px;" class="antialias"><font>Text</font></div></div></div>			</div>		</div>	<div id="overview" class="step" data-state="strut-slide-overview" data-x="2457.6" data-y="2764.8" data-scale="9"></div></div><div class="hint">    <p>Use a spacebar or arrow keys to navigate</p></div></div></div>`;
		let config = "{}";
		localStorage.setItem('preview-string', str);
		localStorage.setItem('preview-config', config);
	})
	.refresh()
	.evaluate(function() { document.querySelector(".hint").remove(); })
	.screenshot(imagePath)
    .end()
    .catch(error => console.error(error));