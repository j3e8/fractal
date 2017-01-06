var FractalMethods = {
	Mandelbrot:  {
		name: "Mandelbrot",
		bounds: {left:-1.75,top:-1.5,right:1,bottom:1.5},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x-y*y + result.startPoint.x;
			result.point.y = 2*x*y + result.startPoint.y;
			return result;
		}
	},
	Mandelbrot3:  {
		name: "3rd power Mandelbrot",
		bounds: {left:-1.5,top:-1.5,right:1.5,bottom:1.5},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x*x - 3*x*y*y + result.startPoint.x;
			result.point.y = 3*x*x*y - y*y*y + result.startPoint.y;
			return result;
		}
	},
	Mandelbrot5: {
		name: "5th power Mandelbrot",
		bounds: {left:-1.5,top:-1.5,right:1.5,bottom:1.5},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x*x*x*x - 9*x*x*x*y*y + 5*x*y*y*y*y + result.startPoint.x;
			result.point.y = 5*x*x*x*x*y - 10*x*x*y*y*y + y*y*y*y*y + result.startPoint.y;
			return result;
		}
	},
	Test:  {
		name: "Test fractal",
		bounds: {left:-1.5,top:-1.5,right:1.5,bottom:1.5},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x*x - 3*x*y*y + x*x - y*y + result.startPoint.x;
			result.point.y = 3*x*x*y - y*y*y + 2*x*y + result.startPoint.y;
			return result;
		}
	},
	Julia: {
		name: "Julia",
		bounds: {left:-1,top:-1,right:1,bottom:1},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x-y*y + result.juliaConstant.x;
			result.point.y = 2*x*y + result.juliaConstant.y;
			return result;
		}
	},
	Julia3: {
		name: "3rd power Julia",
		bounds: {left:-1,top:-1,right:1,bottom:1},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x*x - 3*x*y*y + result.juliaConstant.x;
			result.point.y = 3*x*x*y - y*y*y + result.juliaConstant.y;
			return result;
		}
	},
	Julia5: {
		name: "5th power Julia",
		bounds: {left:-1,top:-1,right:1,bottom:1},
		method: function(result) {
			var x = result.point.x;
			var y = result.point.y;
			result.point.x = x*x*x*x*x - 9*x*x*x*y*y + 5*x*y*y*y*y + result.juliaConstant.x;
			result.point.y = 5*x*x*x*x*y - 10*x*x*y*y*y + y*y*y*y*y + result.juliaConstant.y;
			return result;
		}
	}
};

