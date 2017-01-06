
function Fractal(colorMethod, fractalMethod) {
	this.colorMethod = colorMethod;
	this.fractalMethod = fractalMethod;
	this.imageData = null;
	var self = this;

	this.calculatePoint = function(pt, maxIter, juliaConstant) {
		var result = new FractalResult();
		result.startPoint.x = pt.x;
		result.startPoint.y = pt.y;
		result.point.x = pt.x;
		result.point.y = pt.y;
		result.maxIterations = maxIter;
		result.juliaConstant = juliaConstant;

		function iterate(result) {
			result = self.fractalMethod(result);
			result.iterations++;

			// if the resulting point has not escaped, iterate
			if ((result.point.x - result.startPoint.x)*(result.point.x - result.startPoint.x)+(result.point.y - result.startPoint.y)*(result.point.y - result.startPoint.y) < 16 && result.iterations < result.maxIterations)
				 return iterate(result);
			return result;
		}
		return iterate(result);
	}

	this.setImageData = function(imgData) {
		 this.imageData = imgData;
	}
	
	this.setFractalMethod = function(fractalMethod) {
		this.fractalMethod = fractalMethod;
	}
	this.setColorMethod = function(colorMethod) {
		this.colorMethod = colorMethod;
	}

	// render to the viewer
	this.calculateColumn = function(x, maxIter, quality, juliaConstant) {
		if (!this.imageData)
			return false;
		var w = viewer.getWidth();
		var h = viewer.getHeight();
		var d  = this.imageData.data;
		var bounds = viewer.getBounds();

		var fw = bounds.right - bounds.left;
		var fh = bounds.bottom - bounds.top;

		var stride = w*4;
		var xx = x*4;
		
		if (quality < 1)
			quality = 1;
		if (quality > 5)
			quality = 5;
		var blit = 5 - quality;
		if (blit < 1)
			blit = 1;
		if (x % blit != 0)
			return;
		
		for (var y=0; y<h; y+=blit) {
			var res = self.calculatePoint({x:(x/w)*fw+bounds.left, y:(y/h)*fh+bounds.top}, maxIter, juliaConstant);
			var col = self.colorMethod(res);

			if (quality == 5) {
				// if oversampling is turned on, let's calculate the top, right, bottom, and left pixels, too.
				var top_res = self.calculatePoint({x:(x/w)*fw+bounds.left, y:((y*2-1)/(h*2))*fh+bounds.top}, maxIter, juliaConstant);
				var top_col = self.colorMethod(top_res);
				var bottom_res = self.calculatePoint({x:(x/w)*fw+bounds.left, y:((y*2+1)/(h*2))*fh+bounds.top}, maxIter, juliaConstant);
				var bottom_col = self.colorMethod(bottom_res);
				var left_res = self.calculatePoint({x:((x*2-1)/(w*2))*fw+bounds.left, y:(y/h)*fh+bounds.top}, maxIter, juliaConstant);
				var left_col = self.colorMethod(left_res);
				var right_res = self.calculatePoint({x:((x*2+1)/(w*2))*fw+bounds.left, y:(y/h)*fh+bounds.top}, maxIter, juliaConstant);
				var right_col = self.colorMethod(right_res);

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
}
