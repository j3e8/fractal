
function getXY(HTMLelement) {
	var xy = {
		left:0,
		top:0
	};

	while (HTMLelement) {
		xy.left += HTMLelement.offsetLeft;
		xy.top += HTMLelement.offsetTop;
		HTMLelement = HTMLelement.offsetParent;
	}

	return xy;
}
