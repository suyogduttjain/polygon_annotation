/* This tool is inspired by the example proivded by William Malone (www.williammalone.com)*/
/* Many thanks to him */
/*jslint browser: true */
/*global G_vmlCanvasManager */

	"use strict";	
	var canvas;
	var context;
	var image_names = new Array();
	var image_height = new Array();
	var image_width = new Array();
	var canvasWidth = 490;
	var canvasHeight = 220;
	var colorPurple = "#cb3594";
	var colorBlack = "#000000";
	var colorGreen = "#659b41";
	var colorYellow = "#ffcf33";
	var colorBrown = "#986928";
	var colorRed = "#FF0000";
	var outlineImage = new Image();
	var totalLoadResources = 1;
	var curLoadResNum = 0;
	var paint = false;
	var xOffset = 15;
	var yOffset = 15;
	var radius = 5;
	var clickX = [];
	var clickY = [];
	var breakPoints = [];
	var clickDrag = [];
	var lineExist = [];	
	var annot_type;
	var currX=0;
	var currY=0;
	var startX=0;
	var startY=0;
	var stop_annot=false;	
	var start_time = -1;
	var end_time = -1;
	var all_results = new Array();
	var image_count = 1;
	var total_count = 0;
	var base_url = "./images/";
	var hit_count = 0;
	var mousePressed = false;
	var wentOut = false;
	var bbox_inst = new Array();
	var contour_inst = new Array();
	var dense_inst = new Array();
	var object_name = '';
	
	function setup_instructions(object_name){
	bbox_inst.push("This task requires you to draw tight rectangles around <FONT COLOR=\"#FF0000\"><b>" + object_name + "(s) </b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT> above.");
	bbox_inst.push("<FONT COLOR=\"#0000FF\"><b>A computer program will evaluate the results, so bad work will automatically be filtered out.</b></FONT>");
	bbox_inst.push("Press the left mouse button to start drawing a rectangle, move/drag your mouse (with left button pressed) till you cover the whole object and then release the button.");
	bbox_inst.push("Press \"Reset\" to restart the work, if you make a mistake.");
	bbox_inst.push("Press \"Next\" to go the next image, and Press \"Submit Results\" after the last image to finish the HIT.");
	bbox_inst.push("Press \"No Object\" if you cannot see any object in the image.");
	bbox_inst.push("<h3><b>Examples:</b></h3>");
	bbox_inst.push("<td><img src=\"" + base_url + "ex1_rect.png\" border=5\"></td> <td><img src=\"" + base_url + "ex2_rect.png\" border=5\"></td> <td><img src=\"" + base_url + "ex3_rect.png\" border=5\"></td>");

	contour_inst.push("This task requires you to draw a rough outline around  <FONT COLOR=\"#FF0000\"><b>" + object_name + "(s) </b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT> above.");
	//contour_inst.push("This task requires you to draw a rough outline around the most prominent  <FONT COLOR=\"#FF0000\"><b>" + object_name + "</b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT> above.");
	contour_inst.push("Press the left mouse button to start scribbling, move/drag your mouse (with left button pressed) to draw the outline, release the button when done.");
	contour_inst.push("You can use multiple scribbles to cover the object.");
	contour_inst.push("Press \"Reset\" to restart the work, if you make a mistake.");
	contour_inst.push("Press \"Next\" to go the next image, and Press \"Submit Results\" after the last image to finish the HIT.");
	contour_inst.push("<h3><b>Examples:</b></h3>");
	contour_inst.push("<td><img src=\"" + base_url + "ex1_cont.png\" border=5\"></td> <td><img src=\"" + base_url + "ex2_cont.png\" border=5\"></td> <td><img src=\"" + base_url + "ex3_cont.png\" border=5\"></td>");


	//contour_inst.push("Press \"No Object\" if you cannot see any object in the image.");
	//contour_inst.push("<h3 style=\"color:green\"><b>Good Examples: only single object marked</b></h3>");
	//contour_inst.push("<td><img src=\"" + base_url + "ex1_cont_good.png\" border=5\"></td> <td><img src=\"" + base_url + "ex2_cont_good.png\" border=5\"></td>");
	//contour_inst.push("<h3 style=\"color:red\"><b>Bad Examples: multiple objects marked</b></h3>");
	//contour_inst.push("<td><img src=\"" + base_url + "ex1_cont_bad.png\" border=5\"></td> <td><img src=\"" + base_url + "ex2_cont_bad.png\" border=5\"></td>");

	dense_inst.push("This task requires you to trace a very accurate outline around  <FONT COLOR=\"#FF0000\"><b>" + object_name + "(s) </b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT> above.");
	dense_inst.push("<FONT COLOR=\"#0000FF\"><b>A computer program will evaluate the results, so wrong labeling will automatically be filtered out.</b></FONT>");
	dense_inst.push("Start by clicking somewhere and keep extending the outline by clicking at the next point on the object boundary.");
	dense_inst.push("You will have to close the object boundary by clicking on the starting point, before submitting.");
	dense_inst.push("Press \"Reset\" to restart the work, if you make a mistake.");
	dense_inst.push("Press \"Next\" to go the next image, and Press \"Submit Results\" after the last image to finish the HIT.");
	//dense_inst.push("Press \"No Object\" if you cannot see any object in the image.");
	dense_inst.push("<h3><b>Examples:</b></h3>");
	dense_inst.push("<td><img src=\"" + base_url + "ex1_dense.png\" border=5\"></td> <td><img src=\"" + base_url + "ex2_dense.png\" border=5\"></td> <td><img src=\"" + base_url + "ex3_dense.png\" border=5\"></td>");
	}

	// Clears the canvas.
	function clearCanvas(){		
		context.clearRect(0, 0, canvasWidth, canvasHeight);	
	}

	function drawPoint(x, y, color,pradius) {
			context.beginPath();
			context.lineCap = "round";
			context.lineJoin = "round";
			context.lineWidth = radius;
			context.fillStyle = color;
			context.arc(x,y,pradius,0,2*Math.PI);
			context.fill();
	}

	function drawCircle (x, y, color,pradius) {
			context.beginPath();
			context.lineCap = "round";
			context.lineJoin = "round";
			context.strokeWidth = radius;
			context.strokeStyle = color;
			context.arc(x,y,pradius,0,2*Math.PI);
			context.stroke();
	}
		
	function drawLine (x1, y1, x2, y2, color, pradius) {
			context.beginPath();
			context.lineCap = "round";
			context.lineJoin = "round";
			context.lineWidth = pradius;
			context.strokeStyle = color;
			context.moveTo(x1,y1);
			context.lineTo(x2,y2);
			context.stroke();
	}

	function drawRect (x1, y1, x2, y2, color,pradius) {
			context.beginPath();
			context.lineWidth = pradius;
			context.strokeStyle = color;
			var xval = x1;
			var yval = y1;
			if(x2<xval){
				xval = x2;}
			if(y2<yval){
				yval = y2;}

			context.rect(xval,yval,Math.abs(x2-x1), Math.abs(y2-y1));
			context.stroke();						
	}
		

	function redraw() {		
		// Make sure required resources are loaded before redrawing
		if (curLoadResNum < totalLoadResources) {
			return;
		}

		clearCanvas();
		drawRect(0, 0, canvasWidth, canvasHeight, colorRed,20);
		//Restrict drawing to only image
		context.drawImage(outlineImage, xOffset, yOffset, canvasWidth - 2*xOffset, canvasHeight- 2*yOffset);
		context.save();

		//context.beginPath();
		//context.rect(xOffset, yOffset, canvasWidth - 2*xOffset, canvasHeight- 2*yOffset);
		//context.clip();
		var i;

		if(annot_type == 1)
		{
			for (i = 0; i < clickX.length; i += 2) {
				drawRect(clickX[i],clickY[i],clickX[i+1],clickY[i+1],colorPurple,5)				
			}
		}
		
		if(annot_type == 2)
		{
			for (i = 0; i < clickX.length; i += 1) {
				drawPoint(clickX[i],clickY[i],colorPurple,5)
				if(i>0 && clickDrag[i] == true)
				{
					drawLine(clickX[i-1],clickY[i-1],clickX[i],clickY[i],colorPurple,10)
				}
			}
		}

		if(annot_type == 3)
		{
			for (i = 0; i < clickX.length; i += 1) {				
				if(i>0 && lineExist[i] == true)
				{
					drawLine(clickX[i-1],clickY[i-1],clickX[i],clickY[i],colorPurple,5);
				}
				drawPoint(clickX[i],clickY[i],colorPurple,5)
			}
		
			if(hit_count>1){
				var dst = Math.sqrt(Math.pow(clickX[clickX.length-1]-startX,2)+Math.pow(clickY[clickY.length-1]-startY,2));
				if(dst<=10){
					stop_annot = true;
				}			
			}


			if(stop_annot == false){
				drawLine(clickX[clickX.length-1],clickY[clickY.length-1],currX,currY,colorPurple,5);
				var dstc = Math.sqrt(Math.pow(currX-startX,2)+Math.pow(currY-startY,2));
				if(dstc<=10 && hit_count>1){
					drawCircle(startX,startY,colorYellow,15)
				}			
			}

		}
		context.globalAlpha = 1; // No IE support
		
	}

	function addClick (x, y, dragging, replace_last) {

		if(start_time == -1)
		{
			var dt = new Date();
			start_time = dt.getTime();
		}
		
		if(replace_last == false)
		{
			hit_count = hit_count+1;
			if(stop_annot == true || clickX.length == 0){
				startX=x;
				startY=y;
				stop_annot = false;
				hit_count = 0;
				lineExist.push(false);
				breakPoints.push(clickX.length);
 
			}
			else{
				lineExist.push(true);
			}
			clickX.push(x);
			clickY.push(y);
			clickDrag.push(dragging);	
				
		}
		else
		{
			if(clickX.length%2 ==1){
				clickX.push(x);
				clickY.push(y);
				clickDrag.push(dragging);		
			}
			else{
				clickX[clickX.length-1] = x;
				clickY[clickY.length-1] = y;
				clickDrag[clickDrag.length-1] = dragging;
			}
		}

	}

	function verifyClick () {
		if(annot_type == 1)
		{
			if(clickX.length%2 ==1){
				clickX.pop();
				clickY.pop();
				clickDrag.pop();
			}	
		}
	}


	function press (e) {
		paint = true;
		mousePressed = true;
		currX = e.pageX - this.offsetLeft;
		currY = e.pageY - this.offsetTop;
		if (paint) {				
			
			if(annot_type ==2){
				breakPoints.push(clickX.length);
			}
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, false);			
			redraw();
		}		
			e.preventDefault();
	}	
	function drag (e) {
		currX = e.pageX - this.offsetLeft;
		currY = e.pageY - this.offsetTop;
		if (paint) {
			if(annot_type == 1 && e.which != 0){
				addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, true);
				redraw();
			}
			else if(annot_type == 2 && e.which != 0){				
				addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true, false);
				redraw();
			}			
		}

		if(annot_type == 3){
			redraw();}					
		e.preventDefault();
	}

	function release () {
		paint = false;
		mousePressed = false;
		verifyClick();
		redraw();
	}

	function cancel (e) {
		//paint = false;
		wentOut = true;
		redraw();
	}

	function createUserEvents () {
		
		// Add mouse event listeners to canvas element
		canvas.addEventListener("mousedown", press, false);
		canvas.addEventListener("mousemove", drag, false);
		canvas.addEventListener("mouseup", release, false);
		canvas.addEventListener("mouseout", cancel, false);

		// Add touch event listeners to canvas element
		canvas.addEventListener("touchstart", press, false);
		canvas.addEventListener("touchmove", drag, false);
		canvas.addEventListener("touchend", release, false);
		canvas.addEventListener("touchcancel", cancel, false);	
	}

	function resourceLoaded () {		
		curLoadResNum += 1;
		if (curLoadResNum === totalLoadResources) {
			redraw();
			createUserEvents();
		}

	}
	

	function resetCanvas () {	
		clickX = [];
		clickY = [];
		clickDrag = [];
		lineExist = [];
		breakPoints = [];
		startX=0;
		startY=0;
		hit_count = 0;
		currX=0;
		currY=0;
		start_time = -1;
		end_time = -1;
		stop_annot=false;
		clearCanvas();
		redraw();
                
	}

	function get_results_string()
	{
		var i;
		var result = "img,"+image_names[image_count-1]+",type,"+annot_type+",clicks";
		for (i = 0; i < clickX.length; i += 1) {
			result += ","+clickX[i]+","+clickY[i];
		}
		var total_time = -1;
		if(start_time != -1){	
			var dt = new Date();
			end_time = dt.getTime();
			total_time = end_time - start_time;
		}
		result += ",time,"+total_time;
		result += ",breakpoints";
		for (i = 0; i < breakPoints.length; i += 1) {
			result += ","+breakPoints[i];
		}
		return result;			
	}

	function submitResults()
	{
		if(!verify_annotation())
			return;

		var results = get_results_string();
		all_results.push(results);
		document.getElementById('seg_results').value = all_results.join();
		document.forms["mturk_form"].submit();
	}

	function verify_annotation()
	{
		if(stop_annot == false && annot_type == 3){
			alert("Please close the object boundary before submitting");
			return false;
		}
		return true;
	}

	function nextImage()
	{
		if(!verify_annotation())
			return;
		var results = get_results_string();
		
		all_results.push(results);		
		curLoadResNum -= 1;
		//outlineImage.onload = resourceLoaded;
		//outlineImage.src = image_names[image_count];
		setup_canvas(image_count);
		image_count = image_count + 1;
		if(image_count == total_count)
		{
			document.getElementById('submitButton').disabled = false;
			document.getElementById('nextButton').disabled = true;
		}		
		resetCanvas();
	}
	
	function noObject()
	{
		resetCanvas();
		stop_annot = true;
		if(image_count == total_count)
			submitResults();
		else		
			nextImage();
	}

	function gup(name){
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var tmpURL = window.location.href;
		var results = regex.exec( tmpURL );
		if( results == null )
			return "";
		else
			return results[1];
	}
	
	function setup_canvas(img_id)
	{
		
		
		canvasWidth = image_width[img_id]+2*xOffset;
		canvasHeight = image_height[img_id]+2*yOffset;		
		// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)			
		if(img_id>0)
		{
			document.getElementById('canvasDiv').removeChild(canvas);
		}
		canvas = document.createElement('canvas');
		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);
		canvas.setAttribute('id', 'canvas');
		
		document.getElementById('canvasDiv').appendChild(canvas);
		if (typeof G_vmlCanvasManager !== "undefined") {
			canvas = G_vmlCanvasManager.initElement(canvas);
		}
		context = canvas.getContext("2d"); // Grab the 2d canvas context	

		outlineImage.onload = resourceLoaded;
		outlineImage.src = base_url+image_names[img_id];

	}

	function init () {

			var hit_params = gup('hit_params');
			var tokens = hit_params.split(',');
			var i;
			annot_type = parseInt(tokens[0]);
			object_name = tokens[1].toString();
			setup_instructions(object_name);

			if(annot_type == 1)
				document.getElementById('title_line').innerHTML = "Draw rectangle around  <FONT COLOR=\"#FF0000\"><b>" + object_name +  "(s) </b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT>";
			else if(annot_type == 2)
				//document.getElementById('title_line').innerHTML = "Draw rough outlines around  <FONT COLOR=\"#FF0000\"><b>" + object_name +  "(s) </b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT>";
				document.getElementById('title_line').innerHTML = "Draw rough outlines around the most prominent  <FONT COLOR=\"#FF0000\"><b>" + object_name +  "</b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT>";
			else
				document.getElementById('title_line').innerHTML = "Click on the object boundaries to very accurately outline the <FONT COLOR=\"#FF0000\"><b>" + object_name +  "(s) </b></FONT> in the image shown in the <FONT COLOR=\"#FF0000\"><b>red box</b></FONT>";	

			if(annot_type == 1){
	//			document.getElementById('inst_row'+1).innerHTML = bbox_inst[0];
				for(i=0;i<bbox_inst.length-2;i=i+1){
					document.getElementById('inst_row'+(i+1)).innerHTML = (i+1) + ') ' + bbox_inst[i];
				}
				document.getElementById('inst_row'+(bbox_inst.length-1)).innerHTML = bbox_inst[bbox_inst.length-2];
				document.getElementById('inst_row'+(bbox_inst.length)).innerHTML = bbox_inst[bbox_inst.length-1];
			}
			else if(annot_type == 2)
			{
				document.getElementById('inst_row'+1).innerHTML = contour_inst[0];
				for(i=0;i<contour_inst.length-4;i=i+1){
					document.getElementById('inst_row'+(i+1)).innerHTML = (i+1) + ') ' + contour_inst[i];
				}
				document.getElementById('inst_row'+(contour_inst.length-3)).innerHTML = contour_inst[contour_inst.length-4];
				document.getElementById('inst_row'+(contour_inst.length-2)).innerHTML = contour_inst[contour_inst.length-3];
				document.getElementById('inst_row'+(contour_inst.length-1)).innerHTML = contour_inst[contour_inst.length-2];
				document.getElementById('inst_row'+(contour_inst.length)).innerHTML = contour_inst[contour_inst.length-1];
			}			
			else{
				document.getElementById('inst_row'+1).innerHTML = dense_inst[0];
				for(i=0;i<dense_inst.length-2;i=i+1){
					document.getElementById('inst_row'+(i+1)).innerHTML = (i+1) + ') ' + dense_inst[i];
				}
				document.getElementById('inst_row'+(dense_inst.length-1)).innerHTML = dense_inst[dense_inst.length-2];
				document.getElementById('inst_row'+(dense_inst.length)).innerHTML = dense_inst[dense_inst.length-1];
			}

			for (i=2;i<tokens.length;i=i+3)
			{
				image_names.push(tokens[i]);
				image_height.push(parseInt(tokens[i+1]));
				image_width.push(parseInt(tokens[i+2]));
				total_count = total_count + 1;
			}

			setup_canvas(0);					
			
			if(total_count==1)
			{
				document.getElementById('submitButton').disabled = false;
				document.getElementById('nextButton').disabled = true;
			}		

	}
