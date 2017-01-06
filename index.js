(function() {
	var app = angular.module("FractalApp", []);
	
	app.controller("FractalController", ['$location', '$http', '$scope', '$window', function($location, $http, $scope, $window) {
		// declare some important variables
		$scope.isCalculating = false;
		$scope.loadProgress = 0;
		//$scope.colorMethod = 'blackAndWhite';
		$scope.colorMethods = [];
		for (var property in ColorMethods) {
			$scope.colorMethods.push({name:ColorMethods[property].name, value:property, method:ColorMethods[property].method});
		}
		$scope.colorMethod = $scope.colorMethods[0].value;
		//$scope.fractalMethod = 'Mandelbrot';
		$scope.fractalMethods = [];
		for (var property in FractalMethods) {
			$scope.fractalMethods.push({name:FractalMethods[property].name, value:property, bounds:FractalMethods[property].bounds, method:FractalMethods[property].method});
		}
		$scope.fractalMethod = $scope.fractalMethods[0].value;
		$scope.juliaConstant = {x:-0.687, y:0.312};
		$scope.quality = 4;
		$scope.maxIterations = 500;
		$scope.coordinates = {x:0,y:0};
		$scope.showSettings = false;
		$scope.isFullScreen = false;
		
		$scope.lightboxImage = '';
		$scope.showLightbox = false;
		
		var canvasElement = null;
		var imageData = null;
		var redrawTimeout = null;
		var calculateInterval = null;
		var idealBounds = eval("FractalMethods." + $scope.fractalMethod + ".bounds");
		var bounds = {left:idealBounds.left,top:idealBounds.top,right:idealBounds.right,bottom:idealBounds.bottom};
		var selectBounds = null;
		
		var _loadProgress = 0;
		var fractalMethodAsFunction = FractalMethods.Mandelbrot.method;
		var colorMethodAsFunction = ColorMethods.blackAndWhite.method;
		
		
		$scope.getWidth = function() {
			if (canvasElement)
				return canvasElement.offsetWidth;
			else
				return 0;
		}
		$scope.getHeight = function() {
			if (canvasElement)
				return canvasElement.offsetHeight;
			else
				return 0;
		}
		$scope.getBounds = function() {
			return bounds;
		}
		$scope.setSelectBounds = function(startPt, endPt) {
			var minX = startPt.x < endPt.x ? startPt.x : endPt.x;
			var maxX = startPt.x > endPt.x ? startPt.x : endPt.x;
			var minY = startPt.y < endPt.y ? startPt.y : endPt.y;
			var maxY = startPt.y > endPt.y ? startPt.y : endPt.y;
			selectBounds = {left:minX, right:maxX, top:minY, bottom:maxY};
		}

		$scope.zoomToSelection = function() {
			 var w = $scope.getWidth();
			 var h = $scope.getHeight();
			 var newBounds = {left:0,right:0,top:0,bottom:0};
			 newBounds.left = (selectBounds.left / w) * (bounds.right - bounds.left) + bounds.left;
			 newBounds.right = (selectBounds.right / w) * (bounds.right - bounds.left) + bounds.left;
			 newBounds.top = (selectBounds.top / h) * (bounds.bottom - bounds.top) + bounds.top;
			 newBounds.bottom = (selectBounds.bottom / h) * (bounds.bottom - bounds.top) + bounds.top;
			 bounds = newBounds;
			 selectBounds = null;
		}

		$scope.centerAt = function(mousept) {
			console.log("centerAt (" + mousept.x + ", " + mousept.y + ")");
			var w = $scope.getWidth();
			var h = $scope.getHeight();
			var ptAsPct = {x:mousept.x/w,y:mousept.y/h};
			var fw = bounds.right - bounds.left;
			var fh = bounds.bottom - bounds.top;
			var ctr = {x:bounds.left + ptAsPct.x * fw, y:bounds.top + ptAsPct.y * fh};

			bounds.left = ctr.x - fw/2;
			bounds.top = ctr.y - fh/2;
			bounds.right = bounds.left + fw;
			bounds.bottom = bounds.top + fh;
		}

		// take the current bounds and force them to fit on the current display aspect ratio
		function fitToAspect() {
			console.log("fitToAspect");
			if (!$scope.getWidth() || !$scope.getHeight)
				return;
			
			var pt1 = {x:Number(bounds.left), y:Number(bounds.top)};
			var pt2 = {x:Number(bounds.right), y:Number(bounds.bottom)};
			console.log(pt1);
			console.log(pt2);
			var c = {x:(pt2.x + pt1.x)/2, y:(pt2.y + pt1.y)/2};
			console.log(c);
			var ratio = $scope.getWidth() / $scope.getHeight();
			var selectratio = Math.abs(pt2.x - pt1.x) / Math.abs(pt2.y - pt1.y);
			if (selectratio > ratio) {
				var fw = pt2.x - pt1.x;
				var fh = fw / ratio;
				pt1.y = c.y - fh/2;
				pt2.y = c.y + fh/2;
			}
			else {
				var fh = pt2.y - pt1.y;
				var fw = fh * ratio;
				console.log('frame width: ' + fw);
				pt1.x = c.x - fw/2;
				pt2.x = c.x + fw/2;
			}
			console.log('new bounds: (' + pt1.x + ', ' + pt1.y + ') to (' + pt2.x + ', ' + pt2.y + ')');
			bounds = {top:pt1.y, right:pt2.x, bottom:pt2.y, left:pt1.x};
			$scope.coordinates = {x:(bounds.left + bounds.right)/2, y:(bounds.top + bounds.bottom)/2};
		}
		$scope.fitToFractal = function() {
			console.log("fitToFractal");
			var w = $scope.getWidth();
			var h = $scope.getHeight();
			var ratio = w / h;
			if (ratio <= 1) {
				var fwidth = idealBounds.right - idealBounds.left;
				var fheight = fwidth / ratio;
				bounds.left = idealBounds.left;
				bounds.right = idealBounds.right;
				bounds.top = -fheight/2;
				bounds.bottom = fheight/2;
			}
			else {
				var idealwidth = idealBounds.right - idealBounds.left;
				var fheight = idealBounds.bottom - idealBounds.top;
				var fwidth = fheight * ratio;
				bounds.left = -fwidth * Math.abs(idealBounds.left / idealwidth);
				bounds.right = fwidth * Math.abs(idealBounds.right / idealwidth);;
				bounds.top = idealBounds.top;
				bounds.bottom = idealBounds.bottom;
			}
			$scope.coordinates = {x:(bounds.left + bounds.right)/2, y:(bounds.top + bounds.bottom)/2};
		}
		$scope.fitToWindow = function() {
			console.log("fitToWindow");
			var w = $scope.getWidth();
			var h = $scope.getHeight();
			var oldratio = (bounds.right - bounds.left) / (bounds.bottom - bounds.top);
			var ratio = w / h;
			var center = {x:bounds.left + (bounds.right - bounds.left)/2, y:bounds.top + (bounds.bottom - bounds.top)/2};

			if (ratio < oldratio) {
				var fwidth = bounds.right - bounds.left;
				var fheight = fwidth / ratio;
				bounds.top = center.y - fheight/2;
				bounds.bottom = center.y + fheight/2;
			}
			else {
				var fheight = bounds.bottom - bounds.top;
				var fwidth = fheight * ratio;
				bounds.left = center.x - fwidth/2;
				bounds.right = center.x + fwidth/2;
			}
			$scope.coordinates = {x:(bounds.left + bounds.right)/2, y:(bounds.top + bounds.bottom)/2};
		}
		$scope.clearSelection = function() {
			selectBounds = null;
		}
		$scope.cancel = function() {
			console.log("cancelling");
			clearInterval(calculateInterval);
			$scope.isCalculating = false;
			$scope.clearSelection();
			var ctx = canvasElement.getContext("2d");
			imageData = ctx.createImageData(this.getWidth(),this.getHeight());
			render();
			hideWait();
		}

		$scope.recalculate = function() {
			console.log("recalculate()");
			if (!canvasElement)
				return;

			if ($scope.isCalculating) {
				clearInterval(calculateInterval);
			}

			$scope.$apply(function() {
				$scope.isCalculating = true;
			});
			var ctx = canvasElement.getContext("2d");
			imageData = ctx.createImageData(this.getWidth(),this.getHeight());
			_loadProgress = 0; // 0 - 100
			$scope.loadProgress = 0;

			var w = $scope.getWidth();
			var calculateIncr = 100 / w;

			var x = 0;

			calculateInterval = setInterval(function() {
				calculateColumn(x);
				x++;
				if (x >= w) {
					clearInterval(calculateInterval);
					render();
					$scope.$apply(function() {
						$scope.isCalculating = false;
						_loadProgress = 100;
						$scope.loadProgress = 100;
					});
				}
				$scope.$apply(function() {
					_loadProgress += calculateIncr;
					if (_loadProgress > 100)
						_loadProgress = 100;
					$scope.loadProgress = Math.ceil(_loadProgress);
				});
			}, 0);
		}

		function render() {
			var ctx = canvasElement.getContext("2d");
			if (imageData)
				ctx.putImageData(imageData, 0, 0);
			if (selectBounds) {
				ctx.strokeStyle = "#ff0000";
				ctx.strokeRect(selectBounds.left, selectBounds.top, selectBounds.right-selectBounds.left, selectBounds.bottom-selectBounds.top);
			}
		}
		
		// render to the viewer
		function calculateColumn(x) {
			if (!imageData)
				return false;
			var w = $scope.getWidth();
			var h = $scope.getHeight();
			var d  = imageData.data;

			var fw = bounds.right - bounds.left;
			var fh = bounds.bottom - bounds.top;

			var stride = w*4;
			var xx = x*4;

			if ($scope.quality < 1)
				$scope.quality = 1;
			if ($scope.quality > 5)
				$scope.quality = 5;
			var blit = 5 - $scope.quality;
			if (blit < 1)
				blit = 1;
			if (x % blit != 0)
				return;

			for (var y=0; y<h; y+=blit) {
				var res = calculatePoint({x:(x/w)*fw+bounds.left, y:(y/h)*fh+bounds.top});
				var col = colorMethodAsFunction(res);

				if ($scope.quality == 5) {
					// if oversampling is turned on, let's calculate the top, right, bottom, and left pixels, too.
					var top_res = calculatePoint({x:(x/w)*fw+bounds.left, y:((y*2-1)/(h*2))*fh+bounds.top});
					var top_col = colorMethodAsFunction(top_res);
					var bottom_res = calculatePoint({x:(x/w)*fw+bounds.left, y:((y*2+1)/(h*2))*fh+bounds.top});
					var bottom_col = colorMethodAsFunction(bottom_res);
					var left_res = calculatePoint({x:((x*2-1)/(w*2))*fw+bounds.left, y:(y/h)*fh+bounds.top});
					var left_col = colorMethodAsFunction(left_res);
					var right_res = calculatePoint({x:((x*2+1)/(w*2))*fw+bounds.left, y:(y/h)*fh+bounds.top});
					var right_col = colorMethodAsFunction(right_res);

					// average the resulting colors together
					col.r = Math.ceil(0.2*col.r + 0.2*top_col.r + 0.2*bottom_col.r + 0.2*left_col.r + 0.2*right_col.r);
					col.g = Math.ceil(0.2*col.g + 0.2*top_col.g + 0.2*bottom_col.g + 0.2*left_col.g + 0.2*right_col.g);
					col.b = Math.ceil(0.2*col.b + 0.2*top_col.b + 0.2*bottom_col.b + 0.2*left_col.b + 0.2*right_col.b);

					var idx = stride*y + xx;
					d[idx] = col.r;
					d[idx+1] = col.g;
					d[idx+2] = col.b;
					d[idx+3] = 255;
				}
				else {
					for (var a=0; a<blit; a++) {
						for (var b=0; b<blit; b++) {
							var idx = stride*(y+b) + (x+a)*4;
							d[idx] = col.r;
							d[idx+1] = col.g;
							d[idx+2] = col.b;
							d[idx+3] = 255;
						}
					}
				}
			}
			return true;
		}

		function calculatePoint(pt) {
			var result = new FractalResult();
			result.startPoint.x = pt.x;
			result.startPoint.y = pt.y;
			result.point.x = pt.x;
			result.point.y = pt.y;
			result.maxIterations = $scope.maxIterations;
			result.juliaConstant = $scope.juliaConstant;

			function iterate(result) {
				result = fractalMethodAsFunction(result);
				result.iterations++;

				// if the resulting point has not escaped, iterate
				if ((result.point.x - result.startPoint.x)*(result.point.x - result.startPoint.x)+(result.point.y - result.startPoint.y)*(result.point.y - result.startPoint.y) < 16 && result.iterations < result.maxIterations)
					 return iterate(result);
				return result;
			}
			return iterate(result);
		}
		
		
		$scope.navigateToFractal = function() {
			console.log("navigateToFractal()");
			colorMethodAsFunction = eval('ColorMethods.' + $scope.colorMethod + ".method");
			
			var tmp = eval("FractalMethods." + $scope.fractalMethod + ".method");
			if (tmp != fractalMethodAsFunction) {
				idealBounds = eval("FractalMethods." + $scope.fractalMethod + ".bounds");
				$scope.fitToFractal();
			}
			fractalMethodAsFunction = tmp;

			$location.path('/render');
			$location.search({quality: $scope.quality, colorMethod: $scope.colorMethod, fractalMethod: $scope.fractalMethod, juliaConstantX: $scope.juliaConstant.x, juliaConstantY: $scope.juliaConstant.y, boundsLeft: bounds.left, boundsRight: bounds.right, boundsTop: bounds.top, boundsBottom: bounds.bottom});
		}
		
		// watch $location change
		$scope.$on('$locationChangeSuccess', function() {
			console.log('location changed');
			
			var settings = $location.search();
			console.log(settings);
			
			if (settings.quality)
				$scope.quality = settings.quality;
			if (settings.fractalMethod) {
				$scope.fractalMethod = settings.fractalMethod;
				fractalMethodAsFunction = eval("FractalMethods." + $scope.fractalMethod + ".method");
				idealBounds = eval("FractalMethods." + $scope.fractalMethod + ".bounds");
			}
			if (settings.colorMethod) {
				$scope.colorMethod = settings.colorMethod;
				colorMethodAsFunction = eval("ColorMethods." + $scope.colorMethod + ".method");
			}
			if (settings.juliaConstantX)
				$scope.juliaConstant.x = Number(settings.juliaConstantX);
			if (settings.juliaConstantY)
				$scope.juliaConstant.y = Number(settings.juliaConstantY);
			console.log($scope.juliaConstant);

			if (settings.boundsLeft && settings.boundsRight && settings.boundsTop && settings.boundsBottom) {
				bounds = {top:settings.boundsTop, right:settings.boundsRight, bottom:settings.boundsBottom, left:settings.boundsLeft};
				console.log(bounds);
			}
			else
				$scope.fitToFractal();
			
			// draw
			if (canvasElement)
				$scope.drawFractal();
		});
		
		$scope.drawFractal = function() {
			console.log("$scope.drawFractal()");
			if (canvasElement) {
				showWait();
				$scope.showSettings = false;
				setTimeout(function() {
					$scope.recalculate();
				}, 10);
			}
		}
		
		$scope.resetFractal = function() {
			/*showWait();
			setTimeout(function() {
				$scope.fitToFractal();
				$scope.recalculate();
			}, 10);
			*/
		  $scope.fitToFractal();
		  $scope.navigateToFractal();
		}
		
		function showWait() {
			_loadProgress = 0;
			$scope.loadProgress = 0;
			$scope.isCalculating = true;
		}
		function hideWait() {
			$scope.isCalculating = false;
		}
		
		$scope.goFullScreen = function() {
			$scope.isFullScreen = true;
			if (document.body) {
				console.log("requesting full screen");
				if (document.body.requestFullScreen)
					document.body.requestFullScreen();
				else if (document.body.webkitRequestFullScreen)
					document.body.webkitRequestFullScreen();
				else if (document.body.mozRequestFullScreen)
					document.body.mozRequestFullScreen();
				else if (document.body.msRequestFullScreen)
					document.body.msRequestFullScreen();
			}
		}
		
		$scope.$watch('loadProgress', function() {
			if (_loadProgress < 0)
				_loadProgress = 0;
			if (_loadProgress >= 100) {
				_loadProgress = 100;
				hideWait();
			}
		});
		$scope.$watch('quality', function() {
			if ($scope.quality < 1)
				$scope.quality = 1;
			if ($scope.quality > 5)
				$scope.quality = 5;
		});




		// onload
		angular.element($window).bind('resize', function() {
			console.log("window.resize");
			if (document.webkitIsFullScreen || document.fullscreen || document.mozFullScreen || document.msFullscreenElement)
				$scope.isFullScreen = true;
			else
				$scope.isFullScreen = false;
			showWait();
			var canv = document.getElementById('fractalcanvas');
			var container = document.getElementById('canvascontainer');
			canv.width = container.offsetWidth;
			canv.height = container.offsetHeight;
			if (redrawTimeout)
				clearTimeout(redrawTimeout);
			redrawTimeout = setTimeout(function() {
				$scope.fitToWindow();
				$scope.recalculate();
			}, 500);
		});
		
		// onresize
		angular.element($window).bind('load', function() {
			console.log("window.load");
			canvasElement = document.getElementById('fractalcanvas');
			var container = document.getElementById('canvascontainer');
			canvasElement.width = container.offsetWidth;
			canvasElement.height = container.offsetHeight;

			$scope.coordinates = {x:((bounds.left+bounds.right)/2), y:((bounds.top+bounds.bottom)/2)};


			var settings = $location.search();
			if (!settings.boundsTop || !settings.boundsLeft || !settings.boundsBottom || !settings.boundsRight)
				$scope.fitToFractal();
			else
				fitToAspect();
				
			$scope.drawFractal();
		});
		
		// onkeydown
		angular.element($window).bind('keydown', function(event) {
			console.log("window.keydown");
			if (event.keyCode == 27) { // ESC
				$scope.cancel();
			}
		});
		
		
		var lastClick = {x:0,y:0};
		var isMouseDown = false;
		$scope.mousedown = function(event) {
			var offset = getXY(event.target);
			var click = {x:event.pageX - offset.x, y:event.pageY - offset.y};
			lastClick.x = click.x;
			lastClick.y = click.y;
			isMouseDown = true;
			$scope.showSettings = false;
		}
		$scope.mousemove = function(event) {
			var offset = getXY(event.target);
			var mousept = {x:event.pageX - offset.x, y:event.pageY - offset.y};
			var ratio = $scope.getWidth() / $scope.getHeight();
			var selectratio = Math.abs(mousept.x - lastClick.x) / Math.abs(mousept.y - lastClick.y);
			var pt = mousept;
			if (selectratio > ratio) {
				pt.y = mousept.y;
				if (mousept.x > lastClick.x)
					pt.x = lastClick.x + Math.abs(pt.y-lastClick.y) * ratio;
				else
					pt.x = lastClick.x - Math.abs(pt.y-lastClick.y) * ratio;
			}
			else {
				pt.x = mousept.x;
				if (mousept.y > lastClick.y)
					pt.y = lastClick.y + Math.abs(pt.x-lastClick.x) / ratio;
				else
					pt.y = lastClick.y - Math.abs(pt.x-lastClick.x) / ratio;
			}
			if (isMouseDown) {
				$scope.setSelectBounds(lastClick, pt);
				render();
			}
			event.preventDefault();
		}
		$scope.mouseup = function(event) {
			var offset = getXY(event.target);
			var mousept = {x:event.pageX - offset.x, y:event.pageY - offset.y};
			console.log(offset);
			console.log(event.pageX + ", " + event.pageY);
			console.log(mousept);
			if (Math.abs(mousept.x - lastClick.x) < 3 && Math.abs(mousept.y - lastClick.y) < 3) {
				$scope.centerAt(mousept);
				$scope.coordinates = {x:((bounds.left+bounds.right)/2), y:((bounds.top+bounds.bottom)/2)};
				
				$scope.navigateToFractal();
			}
			else {
				var ratio = $scope.getWidth() / $scope.getHeight();
				var selectratio = Math.abs(mousept.x - lastClick.x) / Math.abs(mousept.y - lastClick.y);
				var pt = mousept;
				if (selectratio > ratio) {
					pt.y = mousept.y;
					if (mousept.x > lastClick.x)
						pt.x = lastClick.x + Math.abs(pt.y-lastClick.y) * ratio;
					else
						pt.x = lastClick.x - Math.abs(pt.y-lastClick.y) * ratio;
				}
				else {
					pt.x = mousept.x;
					if (mousept.y > lastClick.y)
						pt.y = lastClick.y + Math.abs(pt.x-lastClick.x) / ratio;
					else
						pt.y = lastClick.y - Math.abs(pt.x-lastClick.x) / ratio;
				}
				/*showWait();
				setTimeout(function() {
					$scope.setSelectBounds(lastClick, pt);
					$scope.zoomToSelection();
					$scope.clearSelection();
					$scope.coordinates = {x:((bounds.left+bounds.right)/2), y:((bounds.top+bounds.bottom)/2)};
					$scope.recalculate();
				}, 10);*/
				$scope.setSelectBounds(lastClick, pt);
				$scope.zoomToSelection();
				$scope.clearSelection();
				$scope.coordinates = {x:((bounds.left+bounds.right)/2), y:((bounds.top+bounds.bottom)/2)};
				
				$scope.navigateToFractal();
			}
			isMouseDown = false;
		}
		
		$scope.downloadFractal = function() {
			displayWaitMessage("Creating downloadable image...");
			setTimeout(function() {
				var imgUrl = getImage();
				/*var dataURL = canvasElement.toDataURL('image/png');
				dataURL = dataURL.replace("image/png", 'image/octet-stream');
				console.log(dataURL);
				//return;
				document.location.href = dataURL;*/
				//window.open(imgUrl);

				hideWaitMessage();
				
				$scope.lightboxImage = imgUrl;
				$scope.showLightbox = true;
				
			}, 0);
		}
		
		function getURL() {
			var str = 'http://www.flooreight.com/#/render?external=true';
			str += '&quality=' + $scope.quality;
			str += '&colorMethod=' + $scope.colorMethod;
			str += '&fractalMethod=' + $scope.fractalMethod;
			str += '&juliaConstantX=' + $scope.juliaConstant.x;
			str += '&juliaConstantY=' + $scope.juliaConstant.y;
			str += '&boundsLeft=' + bounds.left;
			str += '&boundsRight=' + bounds.right;
			str += '&boundsTop=' + bounds.top;
			str += '&boundsBottom=' + bounds.bottom;
			return str;
		}

		function getImage() {
			var dataURL = canvasElement.toDataURL('image/png');
			console.log("uploading " + dataURL.length + " bytes");
			var fd = new FormData();
			fd.append("file", dataURL);
			fd.append("url", getURL());
			
			var imageUrl = '';
			
			var xmlHttpReq;
			// object creation
			if (window.XMLHttpRequest) { xmlHttpReq = new XMLHttpRequest(); }
			else if (window.ActiveXObject) { xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); }
			
			xmlHttpReq.open('POST', "//flooreight.com/upload.php", false);
			xmlHttpReq.send(fd);
			
			//console.log(xmlHttpReq.responseText);

			var data = JSON.parse(xmlHttpReq.responseText);
			imageUrl = data.url;
			
			return imageUrl;
		}

		$scope.shareMe = function() {
			console.log('shareMe()');
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					doTheShare();
				}
				else {
					FB.login(function(response) {
						if (response.authResponse) {
							doTheShare();
						}
					}, {scope: 'publish_actions'});
				}
			});
		}
		
		function doTheShare() {
			displayWaitMessage("Creating shareable image...");
			setTimeout(function() {
				var imgUrl = getImage();
				console.log('attempt share');
				FB.api(
					'me/objects/flooreightfractal:fractal',
					'post',
					{
						object:{
							app_id: "601127250000954",
							url: getURL(),
							title: "My fractal art",
							description: "Explore your own fractal art at flooreight.com",
							image: {
								url:imgUrl,
								user_generated:false
							}
						}
					},
					function(response) {
						console.log("done sharing");
						hideWaitMessage();
						displayNotification("Your fractal was successfully shared on Facebook.  Thanks!");
						
						// handle the response
						console.log(response);
				  }
				);
			}, 500);
		}
		
		
	}]);
})();

