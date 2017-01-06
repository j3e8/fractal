<?php
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui" />
	<meta name="description" content="Explore your own fractal art at flooreight.com" />
	<meta name="keywords" content="fractals, Mandelbrot, Julia, HTML5, canvas, wallpaper, desktop wallpaper, background, desktop background" />
	<meta property="og:site_name" content="flooreight" /> 
	<meta property="og:type" content="flooreightfractal:fractal"/>
	<meta property="fb:app_id" content="601127250000954" />

	<title>Fractal</title>
	<link rel="image_src" href="fractal250.png" />
	<link rel="stylesheet" type="text/css" href="fractal.css">
	<script language="javascript" type="text/javascript" src="angular.min.js"></script>
	<script language="javascript" type="text/javascript" src="FractalResult.js"></script>
	<script language="javascript" type="text/javascript" src="coloringMethods.js"></script>
	<script language="javascript" type="text/javascript" src="FractalMethods.js"></script>
	<script language="javascript" type="text/javascript" src="helper.js"></script>
	<script language="javascript" type="text/javascript" src="common-1.3.0.js"></script>
	<script language="javascript" type="text/javascript" src="index.js"></script>
</head>
<body ng-app="FractalApp" ng-controller="FractalController">
	<div id="canvascontainer" ng-mousedown="mousedown($event)" ng-mousemove="mousemove($event)" ng-mouseup="mouseup($event)">
		<canvas id="fractalcanvas" width="300" height="200"/>
	</div>
	<div id="waitLayer" ng-show="isCalculating">
		loading...<br/>
		<progress id="loadingbar" max="100" value="{{loadProgress}}"></progress>
		
		<div id="adContainer">
			<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
			<!-- fractal ad -->
			<ins class="adsbygoogle"
				  style="display:inline-block;width:728px;height:90px"
				  data-ad-client="ca-pub-1708854270845516"
				  data-ad-slot="3340529784"></ins>
			<script>
			(adsbygoogle = window.adsbygoogle || []).push({});
			</script>
		</div>
	</div>

	<div id="buttonContainer">
		<input id="resetButton" type="button" value="reset" ng-click="resetFractal()" />
		<input id="fullscreenButton" type="button" value="fullscreen" ng-click="goFullScreen()" />
		
		<input id="settingsButton" type="button" value="settings" ng-click="showSettings=!showSettings" />
	</div>
	
	<div id="settingsContainer" ng-show="showSettings">
		<div id="fractalDiv">
			Fractal:<br/>
			<select ng-model="fractalMethod" ng-options="f.value as f.name for f in fractalMethods"></select>
		</div>

		<div id="constantsDiv" ng-show="fractalMethod.toLowerCase().indexOf('julia') >= 0">
			Constants:<br/>
			<input id="cx" type="number" min="-6" max="6" step="0.001" ng-model="juliaConstant.x">
			<input id="cy" type="number" min="-6" max="6" step="0.001" ng-model="juliaConstant.y">
		</div>
		
		<div id="colorDiv">
			Color:<br/>
			<select ng-model="colorMethod" ng-options="c.value as c.name for c in colorMethods"></select>
		</div>
		
		<div id="qualityDiv">
			Quality:<br/>
			<input type="range" name="quality" min="1" max="5" step="1" ng-model="quality">
		</div>
		
		<div id="goDiv">
			<input id="goButton" type="button" value="draw" ng-click="navigateToFractal()" />
		</div>
	</div>
	
	<div id="coordsContainer">{{coordinates.x}}, {{coordinates.y}}</div>

	
	<div id="fb-root"></div>
	<script>(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=601127250000954&version=v2.0";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	</script>
	
	

	<div id="shareContainer">
		<!--<img id="fbButton" src="FB-f-Logo__blue_100.png" ng-click="shareMe()" />
			<input id="downloadButton" type="button" value="download" ng-click="downloadFractal()" />
		-->
		<div class="fb-share-button" data-href="http://flooreight.com"></div>
	</div>
	
	
	<div id="div#lightboxBlackout" ng-show="showLightbox"></div>
	<div id="lightbox" ng-show="showLightbox">
		<div id="lightboxContent">
			<img id="lightboxImage" ng-src="{{lightboxImage}}" />
			<div id="lightboxInstructions">
				Right click (or Ctrl click on Mac) and choose "Save image as..." to save this fractal to your computer.
			</div>
			<div id="okayDiv">
				<input type="button" value="OK" ng-click="showLightbox=false" />
			</div>
		</div>
	</div>
	
</body>
</html>
