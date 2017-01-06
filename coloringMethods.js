var ColorMethods = {

	blackAndWhite: {
		name: "Black and white",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			col.r = Math.ceil(fractalResult.iterations / fractalResult.maxIterations * 255);
			col.g = Math.ceil(fractalResult.iterations / fractalResult.maxIterations * 255);
			col.b = Math.ceil(fractalResult.iterations / fractalResult.maxIterations * 255);
			return col;
		}
	},

	// method to choose a color based on result
	blueScale: {
		name: "Blue",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			var it = (fractalResult.maxIterations - fractalResult.iterations) / fractalResult.maxIterations * 255;
			col.r = Math.ceil(it * 0.6);
			col.g = Math.ceil(it * 0.8);
			col.b = it;
			return col;
		}
	},
	
	frozen: {
		name: "Frozen",
		method: function(fractalResult) {
			var spectrum = [
				{position:0, color:{r:33,g:166,b:199}},
				{position:0.09, color:{r:181,g:238,b:255}},
				{position:0.18, color:{r:160,g:142,b:250}},
				{position:0.27, color:{r:122,g:171,b:235}},
				{position:0.36, color:{r:46,g:31,b:122}},
				{position:0.45, color:{r:223,g:217,b:255}},
				{position:0.54, color:{r:143,g:118,b:232}},
				{position:0.63, color:{r:158,g:169,b:255}},
				{position:0.72, color:{r:255,g:255,b:255}},
				{position:1, color:{r:255,g:255,b:255}}
			];
			
			//var cycles = 3;
			//var range = fractalResult.maxIterations / cycles;
			//var iter = fractalResult.iterations % cycles;
			
			var range = fractalResult.maxIterations;
			var iter = fractalResult.iterations;
			var totalDistance = 0;
			var maxDistance = 0;
			var minDistance = range;
			for (var i=0; i<spectrum.length; i++) {
				spectrum[i].distance = Math.abs(iter - spectrum[i].position * range);
				totalDistance += spectrum[i].distance;
				if (spectrum[i].distance > maxDistance)
					maxDistance = spectrum[i].distance;
				if (spectrum[i].distance < minDistance)
					minDistance = spectrum[i].distance;
			}
			
			// weight each of the spectrum colors together based on closeness to iter
			var totalWeight = 0;
			for (var i=0; i<spectrum.length; i++) {
				spectrum[i].weight = (maxDistance - spectrum[i].distance)*(maxDistance - spectrum[i].distance);
				totalWeight += spectrum[i].weight;
			}
	
			// assign color based on weight
			var col = {r:0,g:0,b:0};
			for (var i=0; i<spectrum.length; i++) {
				col.r += (spectrum[i].weight / totalWeight) * spectrum[i].color.r;
				col.g += (spectrum[i].weight / totalWeight) * spectrum[i].color.g;
				col.b += (spectrum[i].weight / totalWeight) * spectrum[i].color.b;
			}

			col.r = Math.ceil(col.r);
			col.g = Math.ceil(col.g);
			col.b = Math.ceil(col.b);
			if (col.r > 255)
				col.r = 255;
			if (col.g > 255)
				col.g = 255;
			if (col.b > 255)
				col.b = 255;
			return col;
		}
	},

	hotpink_spectrum: {
		name: "Hot Pink",
		method: function(fractalResult) {
			/*var spectrum = [
				{position:0.0, color:{r:168,g:48,b:37}},
				{position:0.28, color:{r:214,g:111,b:26}},
				{position:0.38, color:{r:214,g:188,b:17}},
				{position:0.55, color:{r:37,g:138,b:168}},
				{position:0.8, color:{r:110,g:25,b:107}}
			];*/
			var spectrum = [
				{position:0.0, color:{r:255,g:255,b:255}},
				{position:0.33, color:{r:0,g:0,b:0}},
				{position:0.67, color:{r:212,g:84,b:124}}
			];
			
			var cycles = 3;
			var range = Math.ceil(fractalResult.maxIterations / cycles);
			var iter = fractalResult.iterations % range;
			
			//var range = fractalResult.maxIterations;
			//var iter = fractalResult.iterations;
			var totalDistance = 0;
			var maxDistance = 0;
			var minDistance = range;
			for (var i=0; i<spectrum.length; i++) {
				spectrum[i].distance = Math.abs(iter - spectrum[i].position * range);
				if (spectrum[i].distance > 0.5 * range)
					spectrum[i].distance = Math.abs(range - spectrum[i].distance);
				totalDistance += spectrum[i].distance;
				if (spectrum[i].distance > maxDistance)
					maxDistance = spectrum[i].distance;
				if (spectrum[i].distance < minDistance)
					minDistance = spectrum[i].distance;
			}
			
			// weight each of the spectrum colors together based on closeness to iter
			var totalWeight = 0;
			for (var i=0; i<spectrum.length; i++) {
				spectrum[i].weight = (maxDistance - spectrum[i].distance)*(maxDistance - spectrum[i].distance);
				totalWeight += spectrum[i].weight;
			}
	
			// assign color based on weight
			var col = {r:0,g:0,b:0};
			for (var i=0; i<spectrum.length; i++) {
				col.r += (spectrum[i].weight / totalWeight) * spectrum[i].color.r;
				col.g += (spectrum[i].weight / totalWeight) * spectrum[i].color.g;
				col.b += (spectrum[i].weight / totalWeight) * spectrum[i].color.b;
			}

			col.r = Math.ceil(col.r);
			col.g = Math.ceil(col.g);
			col.b = Math.ceil(col.b);
			if (col.r > 255)
				col.r = 255;
			if (col.g > 255)
				col.g = 255;
			if (col.b > 255)
				col.b = 255;
			return col;
		}
	},

	// method to choose a color based on result
	finalDistance: {
		name: "Distance",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			//var fullColor = {r:150,g:200,b:255};
			var x2 = (fractalResult.point.x - fractalResult.startPoint.x)*(fractalResult.point.x - fractalResult.startPoint.x);
			var y2 = (fractalResult.point.y - fractalResult.startPoint.y)*(fractalResult.point.y - fractalResult.startPoint.y);
			var sqd = (x2 + y2);
			var maxsqd = 10 * 10;
			var dval = sqd / maxsqd;
			if (dval > 1)
				dval = 1;

			var ival = fractalResult.iterations / fractalResult.maxIterations;

			var startColor = {r:51,g:170,b:181};
			var endColor = {r:156,g:209,b:102};

			col.r = startColor.r + ival*(endColor.r - startColor.r);
			col.g = startColor.g + ival*(endColor.g - startColor.g);
			col.b = startColor.b + ival*(endColor.b - startColor.b);

			var badjust = 0.03;
			col.r = Math.ceil(col.r - dval*badjust*col.r);
			if (col.r < 0) col.r = 0;
			col.g = Math.ceil(col.g - dval*badjust*col.g);
			if (col.g < 0) col.g = 0;
			col.b = Math.ceil(col.b - dval*badjust*col.b);
			if (col.b < 0) col.b = 0;

			return col;
		}
	},

	// rainbow based on iterations
	rainbow: {
		name: "Rainbow",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};

			var center = 128;
			var width = 127;
			var frequency = Math.PI*2 / fractalResult.maxIterations;
			col.r = Math.sin(frequency*fractalResult.iterations+Math.PI/1) * width + center;
			col.g = Math.sin(frequency*fractalResult.iterations+Math.PI/2) * width + center;
			col.b = Math.sin(frequency*fractalResult.iterations+Math.PI/4) * width + center;
			return col;
		}
	},

	// rainbow iterations 2
	lemonade: {
		name: "Lemonade",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};

			var center = 128;
			var width = 127;
			var frequency = Math.PI/2 / fractalResult.maxIterations;
			col.r = Math.sin(frequency*fractalResult.iterations+0) * width + center;
			col.g = Math.sin(frequency*fractalResult.iterations+Math.PI/8) * width + center;
			col.b = Math.sin(frequency*fractalResult.iterations+Math.PI/2) * width + center;
			return col;
		}
	},

	angles: {
		name: "Angles",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			var m = 1000;
			if (fractalResult.point.x - fractalResult.startPoint.x != 0)
				m = (fractalResult.point.y - fractalResult.startPoint.y) / (fractalResult.point.x - fractalResult.startPoint.x);

			var value1 = Math.ceil((m + 15) / 30 * 255);
			if (value1 > 255)
				value1 = 255;
			else if (value1 < 0)
				value1 = 0;

			var x2 = (fractalResult.point.x - fractalResult.startPoint.x)*(fractalResult.point.x - fractalResult.startPoint.x);
			var y2 = (fractalResult.point.y - fractalResult.startPoint.y)*(fractalResult.point.y - fractalResult.startPoint.y);
			var sqd = (x2 + y2);
			var maxsqd = 5 * 5;
			var value2 = sqd / maxsqd;
			value2 = value2 * 255;
			while (value2 > 255)
				value2 -= 255;

			var val = (value1 + value2) / 2;

			var red = {r:185,g:18,b:62};
			col.r = Math.ceil(val/255 * red.r);
			col.g = Math.ceil(val/255 * red.g);
			col.b = Math.ceil(val/255 * red.b);
			return col;
		}
	},

	// method to choose a color based on result
	cherry: {
		name: "Cherry",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			var val = 255 - Math.ceil(fractalResult.iterations / fractalResult.maxIterations * 255);

			// as val approaches 255, colors approach 255
			// as val approaches 0, colors approach red.values
			var red = {r:185,g:18,b:62};
			col.r = Math.ceil(red.r + (val/255 * (255-red.r)));
			col.g = Math.ceil(red.g + (val/255 * (255-red.g)));
			col.b = Math.ceil(red.b + (val/255 * (255-red.b)));
			return col;
		}
	},

	// alternating iterations
	seuss: {
		name: "Seuss",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};

			if (fractalResult.iterations % 2) {
				col.r = 132;
				col.g = 184;
				col.b = 148;
			}
			else {
				col.r = 188;
				col.g = 218;
				col.b = 235;
			}
			return col;
		}
	},
	
	// method to choose a color based on result
	smoothlogdistance: {
		name: "Test",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			var center = 128;
			var width = 127;
			var x2 = (fractalResult.point.x - fractalResult.startPoint.x)*(fractalResult.point.x - fractalResult.startPoint.x);
			var y2 = (fractalResult.point.y - fractalResult.startPoint.y)*(fractalResult.point.y - fractalResult.startPoint.y);
			var d = Math.sqrt(x2 + y2);

			var val = fractalResult.iterations - Math.log(Math.log(d)/2)/Math.LN2;

			var frequency = Math.PI*2 / fractalResult.maxIterations;
			col.r = Math.ceil(Math.sin(frequency*val+Math.PI/2) * width + center);
			col.g = Math.ceil(Math.sin(frequency*val+Math.PI/1) * width + center);
			col.b = Math.ceil(Math.sin(frequency*val+Math.PI/8) * width + center);
			while (col.r > 255) col.r -= 255;
			while (col.g > 255) col.g -= 255;
			while (col.b > 255) col.b -= 255;
			while (col.r < 0) col.r += 255;
			while (col.g < 0) col.g += 255;
			while (col.b < 0) col.b += 255;
			return col;
		}
	},
	
	// method to choose a color based on result
	smoothlog: {
		name: "Grey smoothie",
		method: function(fractalResult) {
			var col = {r:0,g:0,b:0};
			var center = 128;
			var width = 127;
			var x2 = (fractalResult.point.x - fractalResult.startPoint.x)*(fractalResult.point.x - fractalResult.startPoint.x);
			var y2 = (fractalResult.point.y - fractalResult.startPoint.y)*(fractalResult.point.y - fractalResult.startPoint.y);
			var d = Math.sqrt(x2 + y2);

			var val = Math.ceil(Math.log(fractalResult.iterations/fractalResult.maxIterations * 22027) * 25.5);
			if (val > 255)
				val = 255;

			col.r = val;
			col.g = val;
			col.b = val;
			return col;
		}
	}
	
	
}