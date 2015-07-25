window.addEventListener("DOMContentLoaded", function() {
// Connect Audio Sources
var audSrc = (new AudioContext()).createMediaElementSource(audio);
var audSplit = audSrc.context.createChannelSplitter();
audSrc.connect(audSplit);
var audAnalL = audSrc.context.createAnalyser();
var audAnalR = audSrc.context.createAnalyser();
var bufLen = audAnalL.frequencyBinCount;
var audBuf = new Uint8Array(bufLen);
audSplit.connect(audAnalL, 0, 0);
audSplit.connect(audAnalR, 1, 0);
audSrc.connect(audSrc.context.destination);

function channelFix() {
	if (audSplit.channelCount === 1) {
		audSplit.connect(audAnalR, 0, 0);
	} else {
		audSplit.connect(audAnalR, 1, 0);
	}
}

audio.addEventListener("play", channelFix);

var viz = document.getElementById("visualization");
var vizCtx = viz2.getContext("2d");
var vizHeight = viz.height = viz.clientHeight;
var vizWidth = viz.width = viz.clientWidth;
var grd = vizCtx.createLinearGradient(0, 0, vizWidth, vizHeight);
//grd.addColorStop(0, "#FF7F00"/*rgbToHex(255, 127, 0)*/);
//grd.addColorStop(1, "#FF00FF"/*rgbToHex(255, 0, 255)*/);
grd.addColorStop(0, "#F0F");
grd.addColorStop(0.3, "#B8A6DA");
grd.addColorStop(0.5, "#3291d1");
grd.addColorStop(0.7, "#B8A6DA");
grd.addColorStop(1, "#F0F");
vizCtx.fillStyle = grd;
var pixPerBar = vizWidth / (bufLen * 2);

function draw() {
	var xPos = 0;
	vizCtx.clearRect(0, 0, vizWidth, vizHeight);
	vizCtx.beginPath();
	vizCtx.moveTo(xPos, vizHeight);
	audAnalL.getByteFrequencyData(audBuf);
	for (var i = bufLen-1; i >= 0; i--) {
		xPos += pixPerBar;
		var height = (256 - audBuf[i]) * vizHeight / 256;
		vizCtx.lineTo(xPos, height);
	}
	audAnalR.getByteFrequencyData(audBuf);
	for (var i = 0; i < bufLen; i++) {
		xPos += pixPerBar;
		var height = (265 - audBuf[i]) * vizHeight / 256;
		vizCtx.lineTo(xPos, height);
	}
	vizCtx.lineTo(xPos, vizHeight);
	vizCtx.closePath();
	vizCtx.fill();

	//blur(1);
	//stackBlurCanvasRGBA("visualization", 0, 0, vizWidth, vizHeight, blurAmt);
	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

/*								function blur(n) {
									var imgData = vizCtx.getImageData(0, 0, vizWidth, vizHeight);
									var newImgData = vizCtx.createImageData(imgData);
									vizCtx.globalAlpha = (1/(n*2*n*2));
									for (var x = -n; x <= n; x++) {
										for (var y = -n; y <= n; y++) {
											vizCtx.putImageData(imgData, x, y);
										}
									}
									vizCtx.globalAlpha = 1;
								}
}*/
var leftColors = [255, 127, 0];
var rightColors = [255, 0, 255];
});
