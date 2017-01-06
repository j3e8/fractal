/*
    Version: 1.3
    Change Log:
		-added the catchEnter(event, callbackFunc) method (1.2.0)
		-added fadeIn and fadeOut
		-added queueFunction
		-added debugMessage(str)
*/

var isNum = /([0-9]*\.)?[0-9]+/;
var nonDigits = /[^0-9\.]/;
var nonInts = /[^0-9]/;
var ints = /[0-9]/;
var email_regx = /^[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+$/i;


function makeNumber(inputString, allowBlank, precision) {
    if (allowBlank == null)
        allowBlank = false;
        
    var precisionSelected = true;
    if (precision == null){
        precision = 1;
        precisionSelected = false;
    }
    
    inputString = inputString.replace(nonDigits, "");
    if (!isNum.test(inputString)) {
        var i = inputString.indexOf('.');
        var i2 = inputString.indexOf('.', i + 1);
        inputString = inputString.substring(0, i2);
    }
    if (!allowBlank && inputString == ""){
        if (precision == 0){
            inputString = "0";
        } else {
            inputString = "0.";
            for (i = 0; i < precision; i++){
                inputString += "0";    
            }
        }
    }
    
    if (precisionSelected){
        inputString = (inputString * 1).toFixed(precision);
    }
    
    return inputString;
}

function makeInteger(inputString, allowBlank) {
    if (allowBlank == null)
        allowBlank = false;

    inputString = inputString.replace(nonInts, "");
    if (!allowBlank && inputString == "")
        inputString = "0";
    
    return inputString;
}

function padNumber(num) {
    var newName = new String(num);
    var index = newName.indexOf(".");
    if (index == -1)
        newName += ".00";
    else if (index == newName.length - 2)
        newName += "0";
    return newName;
}

function isNumber(str) {
    if (isNum.test(str))
        return true;
    return false;
}

function isInteger(str) {
    if (ints.test(str))
        return true;
    return false;
}

function trim(str) {
    if (str == null || str == undefined || str == "") return "";
    str = str.replace(/^\s*/, '');
    if (str == "") return "";
    return str.replace(/\s*$/, '');
}


/*** requires ../common.js ***/

var screenBlocks = 0;

function blockScreen() {
	var shadowEl = document.getElementById('_shadowOverlay_');
	if (shadowEl == null) {
		shadowEl = document.createElement("DIV");
		shadowEl.id = "_shadowOverlay_";
		shadowEl.style.margin = "0px";
		shadowEl.style.padding = "0px";
		shadowEl.style.opacity = "0.6";
		shadowEl.style.filter = "alpha(opacity=60)";
		shadowEl.style.backgroundColor = "#808080";
		shadowEl.style.position = "fixed";
		shadowEl.style.top = "0";
		shadowEl.style.left = "0";
		shadowEl.style.right = "0";
		shadowEl.style.bottom = "0";
		shadowEl.style.width = "100%";
		shadowEl.style.height =  "100%";
		shadowEl.style.zIndex = "99";
		document.body.appendChild(shadowEl);
	}
	shadowEl.style.display = "block";
	screenBlocks++;
}

function unblockScreen() {
    screenBlocks--;
    if (screenBlocks == 0) {
        var shadowEl = document.getElementById('_shadowOverlay_');
        if (shadowEl != null) {
            shadowEl.style.display = "none";
        }
    }
}

function blockForMessage() {
    var shadowEl = document.getElementById('_shadowMessageOverlay_');
    if (shadowEl == null) {
        shadowEl = document.createElement("DIV");
        shadowEl.id = "_shadowMessageOverlay_";
			shadowEl.style.height = "100%";
        document.body.appendChild(shadowEl);
    }
    shadowEl.style.display = "block";
}

function unblockForMessage() {
    var shadowEl = document.getElementById('_shadowMessageOverlay_');
    if (shadowEl != null)
        shadowEl.style.display = "none";
}

function displayMessage(msg, isWarning, callbackFunction, isCancellable) {
    if (isCancellable == null)
        isCancellable = false;
    blockForMessage();
    var dFromTop = document.body.scrollTop;
    if (dFromTop == 0) {
        if (document.documentElement.scrollTop != null)
            dFromTop = document.documentElement.scrollTop;
    }
    var msgBox = document.getElementById('_messageBox_');
    var msgContainer = document.getElementById('_messageContainer_');
    var msgOkButton = document.getElementById('_messageOkayButton_');
    var msgCancelButton = document.getElementById('_messageCancelButton_');
    var msgElementContainer = document.getElementById('_messageElementContainer_');
    if (msgBox == null) {
        msgBox = document.createElement("DIV");
        msgBox.id = "_messageBox_";
        
        msgContainer = document.createElement("DIV");
        msgContainer.id = "_messageContainer_";
        msgContainer.style.minHeight = "70px";
        msgBox.appendChild(msgContainer);
        
        msgElementContainer = document.createElement("DIV");
        msgElementContainer.id = "_messageElementContainer_";
        msgElementContainer.style.display = "none";
        msgBox.appendChild(msgElementContainer);
        
        var okDiv = document.createElement("DIV");
        okDiv.style.textAlign = "right";
        okDiv.style.padding = "4px";
        okDiv.style.margin = "8px 0px 8px 0px";
        okDiv.style.borderTop = "1px dotted #91c8ce";
        
        msgCancelButton = document.createElement("INPUT");
        msgCancelButton.id = "_messageCancelButton_";
        msgCancelButton.type = "button";
        msgCancelButton.className = "button red";
        msgCancelButton.name = "_messageCancelButton_";
        msgCancelButton.value = "cancel";
        msgCancelButton.onclick = new Function("hideMessage(null)");
        okDiv.appendChild(msgCancelButton);
        okDiv.appendChild(document.createTextNode(" "));
        
        msgOkButton = document.createElement("INPUT");
        msgOkButton.id = "_messageOkayButton_";
        msgOkButton.type = "button";
        msgOkButton.className = "button";
        msgOkButton.name = "_messageOkayButton_";
        msgOkButton.value = "okay";
        okDiv.appendChild(msgOkButton);
        msgBox.appendChild(okDiv);
        
        document.body.appendChild(msgBox);
    }
    
    if (callbackFunction != null && callbackFunction != undefined) {
        msgOkButton.onclick = new Function("hideMessage(" + callbackFunction + ")");
	} else {
        isCancellable = false;
        msgOkButton.onclick = new Function("hideMessage(null)");
    }
    
    if (isCancellable)
        msgCancelButton.style.display = "inline";
    else
        msgCancelButton.style.display = "none";
    
    msgContainer.innerHTML = "";
    msgElementContainer.innerHTML = "";
    msgElementContainer.style.display = "none";
    msgContainer.appendChild(document.createTextNode(msg));
    if (isWarning)
        msgContainer.className = "warning";
    else
        msgContainer.className = "message";
    //msgBox.style.top = String(Number(dFromTop) + 20) + "px";
    msgBox.style.top = '20px';
    msgBox.style.display = "block";
}

function hideMessage(callbackFunction) {
    var el = document.getElementById('_messageBox_');
    var msgEl = document.getElementById('_messageContainer_');
    if (el != null && msgEl != null) {
        msgEl.innerHTML = "";
        el.style.display = "none";
    }
    unblockForMessage();
    
    if (callbackFunction != null && callbackFunction != undefined)
        callbackFunction();
}

function appendElementToMessage(el) {
    var container = document.getElementById('_messageElementContainer_');
    container.style.display = "block";
    container.appendChild(el);
}

function displayWaitMessage(msg) {
    blockForMessage();
    var msgBox = document.getElementById('_waitmessageBox_');
    var msgContainer = document.getElementById('_waitmessageText_');
    var msgButton = document.getElementById('_waitmessageOkayButton_');
    var waitImg = document.getElementById('_waitImage_');
    var waitImgContainer = document.getElementById('_waitImgContainer_');
    if (msgBox == null) {
        msgBox = document.createElement("DIV");
        msgBox.id = "_waitmessageBox_";
        msgBox.className = "_waitmessageBox_";

        waitImgContainer = document.createElement("DIV");
        waitImgContainer.id = "_waitImgContainer_";
        waitImgContainer.style.textAlign = "center";
        waitImgContainer.style.padding = "0px 0px 20px 0px";
		  
			var waiter = new WaitIndicatorSpinner(waitImgContainer, 40, 40, {
				 color:"#222",
				 type:WaitIndicators.RoundPetalFlower,
				 petals:12,
				 sizeDecay:1,
				 alphaDecay:0.82,
				 rotationSpeed:(Math.PI*2)/1700, // radians per ms
				 pulseInterval:350,
				 display: true
			});
        msgBox.appendChild(waitImgContainer);
		  
        
        msgContainer = document.createElement("DIV");
        msgContainer.id = "_waitmessageText_";
        msgContainer.style.minHeight = "70px";
		  msgContainer.style.textAlign = "center";
        msgBox.appendChild(msgContainer);
        
        document.body.appendChild(msgBox);
    }
    msgContainer.innerHTML = "";
	 if (msg)
		msgContainer.appendChild(document.createTextNode(msg));
    msgContainer.className = "message";
    msgBox.style.display = "block";
}

function hideWaitMessage() {
    var el = document.getElementById('_waitmessageBox_');
    var msgEl = document.getElementById('_waitmessageText_');
    if (el != null && msgEl != null) {
        msgEl.innerHTML = "";
        el.style.display = "none";
    }
    unblockForMessage();
}

/***
* Displays a notification message to the user.  It disappears automatically after a few seconds or it can be clicked to dismiss
* @@param {string} messageText - the text to display to the user 
* @returns {}
*/
var __notificationTimeout = null;
function displayNotification(messageText) {
    var msgBoxEl = document.getElementById('__notificationElement__');
    var msgText = document.getElementById('__notificationTextElement__');
    if (!msgBoxEl) {
        msgBoxEl = document.createElement("DIV");
        msgBoxEl.id = "__notificationElement__";
        msgBoxEl.onclick = hideNotification;
        
        msgText = document.createElement("DIV");
        msgText.id = "__notificationTextElement__";
        msgBoxEl.appendChild(msgText);
        
        document.body.appendChild(msgBoxEl);
    }
    msgText.innerHTML = messageText;
    msgBoxEl.style.display = "block";
    __notificationTimeout = setTimeout(hideNotification, 5000);
}
/***
 * Hides any displayed notification from the screen
 * @returns {}
 */
function hideNotification() {
    var msgBoxEl = document.getElementById('__notificationElement__');
    if (msgBoxEl) {
        msgBoxEl.style.display = "none";
    }
}




function getXY(el) {
    var xy = {x:0,y:0};
    while (el) {
        xy.x += el.offsetLeft;
        xy.y += el.offsetTop;
        el = el.offsetParent;
    }
    return xy;
}


function catchEnter(e, callbackFunc) {
	var evtobj=window.event? event : e //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
	var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode

	if (unicode == 13) {
		if (callbackFunc != null)
			callbackFunc();
		return true;
	}

	return false;
}


/*** this section is for fading objects in and out of the screen ***/

var __fadeInArray = new Array();
var __fadeOutArray = new Array();
var __fadeInTimeout = false;
var __fadeOutTimeout = false;

function fadeOut(el, myCallback) {
    if (el) {
        __fadeOutArray.push(new Array(el, 1, myCallback));
        if (!__fadeOutTimeout)
            __doFadeOut();
    }
}

function __doFadeOut() {
    __fadeOutTimeout = true;
    
    var i;
    var step = 0.08;
    for (i=0; i<__fadeOutArray.length; i++) {
        var op = __fadeOutArray[i][1];
        if (op - step < 0) {
            __fadeOutArray[i][1] = 0;
            __fadeOutArray[i][0].style.opacity = 0;
            __fadeOutArray[i][0].style.filter = "alpha(opacity=0)";
            
            // if there's a callback, call it!
            if (__fadeOutArray[i][2])
                setTimeout(__fadeOutArray[i][2], 40);

            __fadeOutArray.splice(i, 1);
        }
        else {
            op -= step;
            __fadeOutArray[i][1] = op;
            __fadeOutArray[i][0].style.opacity = op;
            __fadeOutArray[i][0].style.filter = "alpha(opacity=" + String(op*100) + ")";
        }
    }
    
    if (__fadeOutArray.length > 0) {
        __fadeOutTimeout = setTimeout(__doFadeOut, 40);
        __fadeOutTimeout = true;
    }
    else
        __fadeOutTimeout = false;
}

function fadeIn(el, myCallback) {
    if (el) {
        __fadeInArray.push(new Array(el, 0, myCallback));
        if (!__fadeInTimeout)
            __doFadeIn();
    }
}

function __doFadeIn() {
    __fadeInTimeout = true;
    
    var i;
    var step = 0.08;
    for (i=0; i<__fadeInArray.length; i++) {
        var op = __fadeInArray[i][1];
        if (op + step > 1) {
            __fadeInArray[i][1] = 1;
            __fadeInArray[i][0].style.opacity = 1;
            __fadeInArray[i][0].style.filter = "alpha(opacity=100)";
            
            // if there's a callback, call it!
            if (__fadeInArray[i][2])
                setTimeout(__fadeInArray[i][2], 40);

            __fadeInArray.splice(i, 1);
        }
        else {
            op += step;
            __fadeInArray[i][1] = op;
            __fadeInArray[i][0].style.opacity = op;
            __fadeInArray[i][0].style.filter = "alpha(opacity=" + String(op*100) + ")";
        }
    }
    
    if (__fadeInArray.length > 0) {
        __fadeInTimeout = setTimeout(__doFadeIn, 40);
        __fadeInTimeout = true;
    }
    else
        __fadeInTimeout = false;
}





/*** functions for queuing functions to prevent cancellation of asynchronous ajax requests **/
var __functionQueue = new Array();
var __isExecutingFunction = false;
function queueFunction(myCallback) {
    var isQueued = false;
    for (var i=0; i<__functionQueue.length; i++) {
        if (__functionQueue[i] == myCallback) {
            isQueued = true;
            break;
        }
    }
    if (!isQueued)
        __functionQueue.push(myCallback);
        
    
    if (!__isExecutingFunction) {
        __loadFromFunctionQueue();
    }
    else {
    }
    
}

function __loadFromFunctionQueue() {
    if (!__isExecutingFunction) {
        if (__functionQueue.length > 0) {
            var nextValue = __functionQueue[0];
            __functionQueue.shift();
            
            if (nextValue)
                nextValue();
        }
    }
}

function lockFunctionQueue() {
    __isExecutingFunction = true;
}
function unlockFunctionQueue() {
    __isExecutingFunction = false;
    __loadFromFunctionQueue();
}
/*** END ***/
 
function debugMessage(str) {
	var outputDiv = document.getElementById('__outputConsole');
	
	if (outputDiv == null) {
		outputDiv = document.createElement("DIV");
		outputDiv.id = "__outputConsole";
		outputDiv.style.backgroundColor = "#ffffff";
		outputDiv.style.borderTop = "2px solid #f08080";
		outputDiv.style.padding = "5px";
		outputDiv.style.position = "fixed";
		outputDiv.style.bottom = "0px";
		outputDiv.style.left = "0px";
		outputDiv.style.right = "0px";
		outputDiv.style.height = "120px";
		outputDiv.style.overflowY = "scroll";
		document.body.appendChild(outputDiv);
	}
	
	outputDiv.appendChild(document.createTextNode(str));
	outputDiv.appendChild(document.createElement("BR"));
}


/*** Ajax object that can be used to make GET or POST requests synchronously or asynchronously
 * by using the function queue in this library
 ***/
function Ajax(httpMethod, ajaxUrl, postArguments, callbackMethod) {
	this.send = send;
	this.sendAjax = sendAjax;
	
	// variables used for closure
	var method = httpMethod;
	var url = ajaxUrl;
	var args = postArguments;
	/*console.log(typeof postArguments);
	if (postArguments !== null && typeof postArguments === 'object') {
		args = "1=1";
		for (property in postArguments) {
			args += "&" + encodeURIComponent(property) + "=" + encodeURIComponent(postArguments[property]);
		}
		console.log(args);
	}*/
	var callback = callbackMethod
	var xmlHttpReq = null;
	
	// sanitization
	method = method.toUpperCase();
	if (method != 'GET')
		method = 'POST';
	
	// object creation
	if (window.XMLHttpRequest) { self.xmlHttpReq = new XMLHttpRequest(); }
	else if (window.ActiveXObject) { self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); }

	// send method
	function send(isAsynchronous) {
		if (isAsynchronous) {
			//alert('queueing sendAjax function');
			queueFunction(this.sendAjax);
		}
		else {
			self.xmlHttpReq.open(method, url, false);
			//self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			self.xmlHttpReq.send(args);
		}
	}
	
	this.getResponseText = function() {
		if (self.xmlHttpReq)
			return self.xmlHttpReq.responseText;
	}
	
	// send method callback used for function queueing
	function sendAjax() {
		//alert('in Ajax::sendAjax about to send');
		self.xmlHttpReq.open(method, url, true);
		self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		self.xmlHttpReq.onreadystatechange = function() {
			if (self.xmlHttpReq.readyState == 4) {
				//alert('Ajax response received - calling callback()');
				if (callback != null)
					callback(self.xmlHttpReq.responseText);
				//alert('callback() complete');
			}
		}
		self.xmlHttpReq.send(args);
		//alert('Ajax::send complete');
	}
}
var ajaxURL;

function updateStateList(countryCode, stateSel, stateInp) {
	if (stateSel == null || stateInp == null)
		return;
	
	var ajax = new Ajax("POST", 
		ajaxURL + "/?action=get-states", 
		"country_code=" + countryCode, 
		function(responseText) {
			// clear both state input methods
			stateInp.value = "";
			while (stateSel.options.length > 0)
				stateSel.remove(0);
			
			if (responseText.trim() == '') {
				// make the text input visible
				stateInp.style.display = "inline";
				stateSel.style.display = "none";
			}
			else {
				// make the select element visible and populate it
				var lines = responseText.split("\n");
				for (i=0; i<lines.length; i++) {
					if (lines[i].trim() != '') {
						var parts = lines[i].split("|");
						if (parts.length > 1 && parts[0].trim() != "" && parts[1].trim() != "") {
							var opt = document.createElement("OPTION");
							opt.value = parts[0];
							opt.innerHTML = parts[1];
							stateSel.appendChild(opt);
						}
					}
				}
				stateInp.style.display = "none";
				stateSel.style.display = "inline";
			}
		}
		);
	ajax.send(true);
}


/***
 * Converts an ArrayBuffer object (gained from a file input) into a base64 string for JSON upload
 * @param {ArrayBuffer} buffer
 * @returns {Base64 String}
 */
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i=0; i<len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary);
}




var WaitIndicators = {
    CircleFlower: 0,
    Flower: 1,
    Bars: 2,
    Circles: 3,
    RoundPetalFlower: 4
};
function WaitIndicatorSpinner(parentHTMLelement, width, height, options) {
    this.parentHTMLelement = parentHTMLelement;
    this.canvasElement = document.createElement("CANVAS");
    this.canvasElement.style.display = "inline-block";
    this.canvasElement.width = width;
    this.canvasElement.height = height;
    this.color = {r:0, g:0, b:0};
    if (options && options.color && options.color.substring(0, 1) == '#') {
        options.color = options.color.substring(1);
        var c = options.color;
        if (options.color.length == 3) {
            var ch1 = options.color.substring(0, 1);
            var ch2 = options.color.substring(1, 2);
            var ch3 = options.color.substring(2, 3);
            c = ch1.concat(ch1).concat(ch2).concat(ch2).concat(ch3).concat(ch3);
        }
        this.color.r = parseInt(c.substring(0, 2), 16);
        this.color.g = parseInt(c.substring(2, 4), 16);
        this.color.b = parseInt(c.substring(4, 6), 16);
    }
    
    var self = this;
    
    var indicatorType = WaitIndicators.CircleFlower;
    if (options && options.type != null)
        indicatorType = options.type;
    var petals = 8;
    if (options && options.petals)
        petals = options.petals;
    var rotationSpeed = Math.PI*2 / 1500; // radians per ms
    if (options && options.rotationSpeed)
        rotationSpeed = options.rotationSpeed;
    var pulseInterval = 100; // ms per pulse
    if (options && options.pulseInterval)
        pulseInterval = options.pulseInterval;
    var sizeDecay = 0.95;
    if (options && options.sizeDecay && options.sizeDecay >= 0 && options.sizeDecay <= 1)
        sizeDecay = options.sizeDecay;
    var alphaDecay = 0.65;
    if (options && options.alphaDecay && options.alphaDecay >= 0 && options.alphaDecay <= 1)
        alphaDecay = options.alphaDecay;
    
    var shortestSide = width < height ? width : height;
    
    var elapsedTime = 0;
    var currentPulse = 0;
    var currentAngle = 0;
    var prevTimestamp = (new Date()).getTime();
    
    function animateFrame() {
        var ms = (new Date()).getTime() - prevTimestamp;
        elapsedTime += ms;
        if (elapsedTime >= pulseInterval) {
            elapsedTime -= pulseInterval;
            currentPulse++;
            if (currentPulse >= petals)
                currentPulse -= petals;
        }
        
        var ctx = self.canvasElement.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
        
        switch(indicatorType) {
            case WaitIndicators.Flower:
            case WaitIndicators.CircleFlower:
            case WaitIndicators.RoundPetalFlower:
                // rotating indicators
                currentAngle += rotationSpeed * ms;
                if (currentAngle >= Math.PI * 2)
                    currentAngle -= Math.PI * 2;
                ctx.translate(width/2, height/2);
                ctx.rotate(currentAngle);
                break;
            default:
                break;
        }
        
        for (var i=0; i<petals; i++) {
            var r = self.color.r;
            var g = self.color.g;
            var b = self.color.b;
            var a = 1.0 * Math.pow(alphaDecay, i);
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
            
            switch(indicatorType) {
                case WaitIndicators.Bars:
                    var x = (currentPulse-i)*(width/petals);
                    if (x < 0)
                        x += width;
                    ctx.rect(x, 0, width/petals, height);
                    break;
                case WaitIndicators.Circles:
                    var radius = height/2 < width/petals/2 ? height/2 : width/petals/2;
                    var w = width - 2 * radius;
                    var x = (currentPulse-i)*(w/(petals-1));
                    if (x < 0)
                        x += w*(1+1/(petals-1));
                    ctx.arc(radius+x,height/2,radius*(Math.pow(sizeDecay, i)),0,2*Math.PI);
                    break;
                case WaitIndicators.Flower:
                    ctx.rotate(-Math.PI*2 / petals);
                    ctx.rect(-shortestSide*0.05, -shortestSide*0.24-shortestSide*0.18, shortestSide*0.1, shortestSide*0.32);
                    break;
                case WaitIndicators.RoundPetalFlower:
                    ctx.rotate(-Math.PI*2 / petals);
                    ctx.arc(0, -shortestSide*0.4,shortestSide*0.03, Math.PI, 2*Math.PI);
                    ctx.arc(0, -shortestSide*0.22,shortestSide*0.03, 0, Math.PI);
                    break;
                case WaitIndicators.CircleFlower:
                default:
                    ctx.rotate(-Math.PI*2 / petals);
                    ctx.arc(0,-shortestSide*0.35,shortestSide*0.1*(Math.pow(sizeDecay, i)),0,2*Math.PI);
                    break;
            }
            ctx.fill();
        }
        prevTimestamp = (new Date()).getTime();
    }
    this.animationInterval = setInterval(animateFrame, 40);
    
    this.show = function() {
        this.canvasElement.style.display = "inline-block";
    }
    this.hide = function() {
        this.canvasElement.style.display = "none";
    }
    
    if (this.parentHTMLelement) {
        this.parentHTMLelement.appendChild(this.canvasElement);
        if (options && options.display == false)
            this.hide();
    }
}