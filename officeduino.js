	
	    var RGB=new Array();
	    RGB[0]= 0;
	    RGB[1]= 0;
	    RGB[2]= 0;
    	var HSL=new Array();
    	HSL[0]= 0;
    	HSL[1]= 0;
    	HSL[2]= 0;
    	
		var relaisCpu;
		var relaisVer;
		var relaisK;
		var relaisT;
		var fetK;
		var fetT;
    
    	var ALL = 1;
	    	
	    var url = "http://192.168.0.203/i";	
	    
	    
	    function callback(ra,rb,rc,rd,fe,ff,fr,fg,fb,t) {
	        RGB[0] = fr;
	        RGB[1] = fg;
	        RGB[2] = fb;
	        relaisCpu = ra;
	        relaisVer = rb;
	        relaisK = rc;
	        relaisT = rd;
	        fetK = fe;
	        fetT = ff;
	        ALL = t;
	        Setter();
	    }
	    
	    function Setter() {
	    	
	    	switch (relaisVer) {
	    		case 0:		var x = $('#VerSlider');
	    					x[0].selectedIndex = 0;
	    					x.slider("refresh");
	    					break;
	    		case 1:		var x = $('#VerSlider');
	    					x[0].selectedIndex = 1;
	    					x.slider("refresh");
	    					break;
	    	}
	    	switch (relaisK) {
	    		case 0:		var x = $('#Kdesk');
	    					x[0].selectedIndex = 0;
	    					x.slider("refresh");
	    					break;
	    		case 1:		var x = $('#Kdesk');
	    					x[0].selectedIndex = 1;
	    					x.slider("refresh");
	    					break;
	    	}
	    	switch (relaisT) {
	    		case 0:		var x = $('#Tdesk');
	    					x[0].selectedIndex = 0;
	    					x.slider("refresh");
	    					break;
	    		case 1:		var x = $('#Tdesk');
	    					x[0].selectedIndex = 1;
	    					x.slider("refresh");
	    					break;
	    	}
	    	switch (fetK) {
	    		case 0:		var x = $('#Klight');
	    					x[0].selectedIndex = 0;
	    					x.slider("refresh");
	    					break;
	    		case 1:		var x = $('#Klight');
	    					x[0].selectedIndex = 1;
	    					x.slider("refresh");
	    					break;
	    	}
	    	switch (fetT) {
	    		case 0:		var x = $('#Tlight');
	    					x[0].selectedIndex = 0;
	    					x.slider("refresh");
	    					break;
	    		case 1:		var x = $('#Tlight');
	    					x[0].selectedIndex = 1;
	    					x.slider("refresh");
	    					break;
	    	}
	    	$("#slider-red").val(RGB[0]).slider("refresh");
	    	$("#slider-green").val(RGB[1]).slider("refresh");
	    	$("#slider-blue").val(RGB[2]).slider("refresh");
	    	if (RGB[0] !== 0 || RGB[1] !== 0 || RGB[2] !== 0){
	    		var color = "#"+ intToHex(RGB[0])+ intToHex(RGB[1])+ intToHex(RGB[2]);
	    		$.farbtastic('#colorpicker').setColor(color);
	    		SetAmbient();
	    	}
	    	else {
	    		var x = $('#ambientOI');
	    		x[0].selectedIndex = 0;
	    		x.slider('refresh');
	    	}
	    	
	    }
	    
	    function intToHex(i) {  
	        var hex = parseInt(i).toString(16);  
	        return (hex.length < 2) ? "0" + hex : hex;  
	    } 
	    
	    function hslToRgb(h, s, l){
	        var r, g, b;
	    
	        if(s == 0){
	            r = g = b = l; // achromatic
	        }else{
	            function hue2rgb(p, q, t){
	                if(t < 0) t += 1;
	                if(t > 1) t -= 1;
	                if(t < 1/6) return p + (q - p) * 6 * t;
	                if(t < 1/2) return q;
	                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	                return p;
	            }
	    
	            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	            var p = 2 * l - q;
	            r = hue2rgb(p, q, h + 1/3);
	            g = hue2rgb(p, q, h);
	            b = hue2rgb(p, q, h - 1/3);
	        }
	    
	        return [r * 255, g * 255, b * 255];
	    }
	    
	    
	    function MakeUrl() {
	    	if (fetK == 1 || fetT == 1 || RGB[0] !== 0 || RGB[1] !== 0 || RGB[2] !== 0) {
	    		relaisCpu = 1;
	    	}
	    	else {
	    		relaisCpu = 0;
	    	}
	    	var x = "http://192.168.0.203/s?a="+relaisCpu+"&b="+relaisVer+"&c="+relaisK+"&d="+relaisT+"&e="+fetK+"&f="+fetT+"&g="+ Math.round(RGB[0]) +"&h="+ Math.round(RGB[1]) +"&i="+ Math.round(RGB[2]) +"&j="+1;
	    	return x;
	    }
	    
	    
	    function Send(a) {
	    	$.getScript(a,function () {
	    	})
	    }
	    
	    
	    function SetAmbient(){
    		var x = $('#ambientOI');
    		x[0].selectedIndex = 1;
    		x.slider('refresh');
	    }
		    
		$(function () {
			
			$('#VerSlider').change(function () {
				var x = $(this);
				var y = x[0].selectedIndex == 1 ? true:false;
				if(y){
					relaisVer = 1;
				} else {
					relaisVer = 0;
				}
				Send(MakeUrl());
			});
			
			$('#Kdesk').change(function () {
				var x = $(this);
				var y = x[0].selectedIndex == 1 ? true:false;
				if(y){
					relaisK = 1;
				} else {
					relaisK = 0;;
				}
				Send(MakeUrl());
			});
			
			$('#Klight').change(function () {
				var x = $(this);
				var y = x[0].selectedIndex == 1 ? true:false;
				if(y){
					fetK = 1;
				} else {
					fetK = 0;;
				}
				Send(MakeUrl());
			});
			$('#Tdesk').change(function () {
				var x = $(this);
				var y = x[0].selectedIndex == 1 ? true:false;
				if(y){
					relaisT = 1;
				} else {
					relaisT = 0;
				}
				Send(MakeUrl());
			});
			$('#Tlight').change(function () {
				var x = $(this);
				var y = x[0].selectedIndex == 1 ? true:false;
				if(y){
					fetT = 1;
				} else {
					fetT = 0;
				}

				Send(MakeUrl());
			});
			
			$('#ambientOI').change(function () {
				var x = $(this);
				var y = x[0].selectedIndex == 1 ? true:false;
				if(y){
					var a = $.farbtastic('#colorpicker').hsl; 
					RGB = hslToRgb(a[0],a[1],a[2]);
				} else {
					RGB[0] = 0;
					RGB[1] = 0;
					RGB[2] = 0;
				}
				Send(MakeUrl());
			});			
			
			$('#colorpicker').farbtastic(function () { 
				var a = $.farbtastic('#colorpicker').hsl; 
				RGB = hslToRgb(a[0],a[1],a[2]);
				if (RGB[0] != 0 && RGB[1] != 0 && RGB[2] != 0){
					SetAmbient();
				}
			});
			
			$('#sliders').mouseup(function () {
				RGB[0] = $("#slider-red").val();
				RGB[1] = $("#slider-green").val();
				RGB[2] = $("#slider-blue").val();
				Send(MakeUrl());
			});
			
			$('#colorpicker').mouseup(function () {Send(MakeUrl())})			
			Send(url);
		})