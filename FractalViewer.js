function Viewer(canvasElement, colorMethod, fractalMethod) {
	this.canvasElement = canvasElement;
	this.fractal = new Fractal(colorMethod, fractalMethod);

	this.maxBounds = {left:-2,top:-1.5,right:1,bottom:1.5};
	this.idealBounds = {left:-2,top:-1.5,right:1,bottom:1.5};
	this.bounds = {left:-2,top:-1.5,right:1,bottom:1.5};
	this.selectBounds = null;
	
	this.quality = 4;
	this.maxIterations = 500;
	this.juliaConstant = {x:-0.687, y:0.312};
	
	var self = this;

	this.getWidth = function() {
		 return this.canvasElement.offsetWidth;
	}
	this.getHeight = function() {
		 return this.canvasElement.offsetHeight;
	}
	this.getBounds = function() {
		 return this.bounds;
	}
	this.setSelectBounds = function(startPt, endPt) {
		 var minX = startPt.x < endPt.x ? startPt.x : endPt.x;
		 var maxX = startPt.x > endPt.x ? startPt.x : endPt.x;
		 var minY = startPt.y < endPt.y ? startPt.y : endPt.y;
		 var maxY = startPt.y > endPt.y ? startPt.y : endPt.y;
		 this.selectBounds = {left:minX, right:maxX, top:minY, bottom:maxY};
	}
	this.setFractalMethod = function(fractalMethod) {
		this.fractal.setFractalMethod(fractalMethod);
	}
	this.setColorMethod = function(colorMethod) {
		this.fractal.setColorMethod(colorMethod);
	}
	this.setQuality = function(value) {
		this.quality = Number(value);
		if (this.quality < 1)
			this.quality = 1;
		if (this.quality > 5)
			this.quality = 5;
	}
	this.setConstants = function(valueX, valueY) {
		this.juliaConstant.x = Number(valueX);
		this.juliaConstant.y = Number(valueY);
	}
	
	this.zoomToSelection = function() {
		 var w = this.getWidth();
		 var h = this.getHeight();
		 var newBounds = {left:0,right:0,top:0,bottom:0};
		 newBounds.left = (this.selectBounds.left / w) * (this.bounds.right - this.bounds.left) + this.bounds.left;
		 newBounds.right = (this.selectBounds.right / w) * (this.bounds.right - this.bounds.left) + this.bounds.left;
		 newBounds.top = (this.selectBounds.top / h) * (this.bounds.bottom - this.bounds.top) + this.bounds.top;
		 newBounds.bottom = (this.selectBounds.bottom / h) * (this.bounds.bottom - this.bounds.top) + this.bounds.top;
		 this.bounds = newBounds;
		 this.clearSelection();
	}
	
	this.centerAt = function(mousept) {
		var w = this.getWidth();
		var h = this.getHeight();
		var ptAsPct = {x:mousept.x/w,y:mousept.y/h};
		var fw = this.bounds.right - this.bounds.left;
		var fh = this.bounds.bottom - this.bounds.top;
		var ctr = {x:this.bounds.left + ptAsPct.x * fw, y:this.bounds.top + ptAsPct.y * fh};
		
		this.bounds.left = ctr.x - fw/2;
		this.bounds.top = ctr.y - fh/2;
		this.bounds.right = this.bounds.left + fw;
		this.bounds.bottom = this.bounds.top + fh;
	}
	
	this.fitToFractal = function() {
		 var w = this.getWidth();
		 var h = this.getHeight();
		 var ratio = w / h;
		 if (ratio <= 1) {
			  var fwidth = this.idealBounds.right - this.idealBounds.left;
			  var fheight = fwidth / ratio;
			  this.bounds.left = this.idealBounds.left;
			  this.bounds.right = this.idealBounds.right;
			  this.bounds.top = -fheight/2;
			  this.bounds.bottom = fheight/2;
		 }
		 else {
			  var idealwidth = this.idealBounds.right - this.idealBounds.left;
			  var fheight = this.idealBounds.bottom - this.idealBounds.top;
			  var fwidth = fheight * ratio;
			  this.bounds.left = -fwidth * Math.abs(this.idealBounds.left / idealwidth);
			  this.bounds.right = fwidth * Math.abs(this.idealBounds.right / idealwidth);;
			  this.bounds.top = this.idealBounds.top;
			  this.bounds.bottom = this.idealBounds.bottom;
		 }
	}
	this.fitToWindow = function() {
		var w = this.getWidth();
		var h = this.getHeight();
		var oldratio = (this.bounds.right - this.bounds.left) / (this.bounds.bottom - this.bounds.top);
		var ratio = w / h;
		var center = {x:this.bounds.left + (this.bounds.right - this.bounds.left)/2, y:this.bounds.top + (this.bounds.bottom - this.bounds.top)/2};

		if (ratio < oldratio) {
			 var fwidth = this.bounds.right - this.bounds.left;
			 var fheight = fwidth / ratio;
			 this.bounds.top = center.y - fheight/2;
			 this.bounds.bottom = center.y + fheight/2;
		}
		else {
			 var fheight = this.bounds.bottom - this.bounds.top;
			 var fwidth = fheight * ratio;
			 this.bounds.left = center.x - fwidth/2;
			 this.bounds.right = center.x + fwidth/2;
		}
	}
	this.clearSelection = function() {
		this.selectBounds = null;
	}
	this.cancel = function() {
		clearInterval(calculateInterval);
		isCalculating = false;
		this.clearSelection();
		var ctx = this.canvasElement.getContext("2d");
		this.fractal.setImageData(ctx.createImageData(this.getWidth(),this.getHeight()));
		this.render();
	}
	 
	var isCalculating = false;
	var calculateInterval = null;
	this.recalculate = function(updateProgressCallback) {
		if (isCalculating) {
			clearInterval(calculateInterval);
		}
		  
		isCalculating = true;
		var ctx = this.canvasElement.getContext("2d");
		this.fractal.setImageData(ctx.createImageData(this.getWidth(),this.getHeight()));
		var calculateProgress = 0; // 0 - 100
		var w = this.getWidth();
		var calculateIncr = 100 / w;

		var x = 0;
		if (updateProgressCallback)
			updateProgressCallback(0);
		
		calculateInterval = setInterval(function() {
			self.fractal.calculateColumn(x, self.maxIterations, self.quality, self.juliaConstant);
			x++;
			if (x >= w) {
				clearInterval(calculateInterval);
				self.render();
				isCalculating = false;
				if (updateProgressCallback)
					updateProgressCallback(100);
			}
			calculateProgress += calculateIncr;
			if (calculateProgress > 100)
				calculateProgress = 100;
			if (updateProgressCallback)
				updateProgressCallback(calculateProgress);
		}, 0);
	}
	
   this.render = function() {
		var ctx = this.canvasElement.getContext("2d");
		if (this.fractal && this.fractal.imageData)
			ctx.putImageData(this.fractal.imageData, 0, 0);
		if (this.selectBounds) {
			ctx.strokeStyle = "#ff0000";
			ctx.strokeRect(this.selectBounds.left, this.selectBounds.top, this.selectBounds.right-this.selectBounds.left, this.selectBounds.bottom-this.selectBounds.top);
		}
   }
    
	this.fitToFractal();
}
