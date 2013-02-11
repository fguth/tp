/*	
	Original Content Copyright 2012, Erland Kelley
	Guild Wars 2 is a registered trademark of NCsoft Corporation.
*/

var gx; var gb; var gs; var gp;

function init() { setInterval(function(){ calculate()},200); }

function calculate() {

	// fix quantities
	fix();
	
	// get variables
	var x = Number(document.forms["trade"]["quantity"].value); if (x < 1) x = 1;
	var b = toCopper("buy");
	var s = toCopper("sell");
	
	// check to see if variables have changed
	if (x == gx && b == gb && s == gs) return null;
	gx = x; gb = b; gs = s;
	
	// calculate profit variables
	var c = b * x;
	var r = s * x;
	var l = Math.max(Math.round(r * 0.05), 1);
	var f = Math.round(r * 0.10);
	var p = r - c - l - f;		
	
	// display profit variables
	document.getElementById("profit").innerHTML = toGSC(p, true);
	
	// calculate break even points
	var evenBuy = s - Math.round((Math.max(Math.round(0.05*s*x),1) + Math.round(0.10*s*x)) / x);
	var evenSell = Math.floor(b / 0.85);			
	if (evenSell != 0) while (profit(x, b, evenSell) < 0) evenSell ++;

	// display break-even points
	document.getElementById("buy-break-even").innerHTML = ((p != 0 && s != 0 && b != evenBuy) ? "even @ " + toGSC(evenBuy, false) : " ");
	document.getElementById("buy-break-even").href = "javascript:setField('buy'," + evenBuy + ");";
	document.getElementById("sell-break-even").innerHTML = ((p != 0 && b != 0 && s != evenSell) ? "even @ " + toGSC(evenSell, false) : " ");			
	document.getElementById("sell-break-even").href = "javascript:setField('sell'," + evenSell + ");";
	
	// calculate and display profit margin percentage
	document.getElementById("profit-percent").innerHTML = ((p != 0 && r != 0) ? "" + (p > 0 ? "+" : "") + (Math.round((p / r) * 1000) / 10) + "%" : "&nbsp;");

	// color-code profit
	document.getElementById("profit").className = "money" + (p < 0 ? " negative" : ((p > 0) ? " positive" : ""));

	// wrap up
	hasChanged = false;
	return p;
	
}

function profit(x, b, s) {
	var c = b * x;
	var r = s * x;
	var l = Math.round(r * 0.05);  if (l < 1) l = 1;
	var f = Math.round(r * 0.10);
	return (r - c - l - f);
}

function setField(field, val) {
	document.forms["trade"][(field+"-gold")].value = "";
	document.forms["trade"][(field+"-silver")].value = "";
	document.forms["trade"][(field+"-copper")].value = val;	
	calculate();
}

function toCopper(field) {

	if (field == "buy") {
		return	Number(document.forms["trade"]["buy-gold"].value) * 10000 +
				Number(document.forms["trade"]["buy-silver"].value) * 100 +
				Number(document.forms["trade"]["buy-copper"].value);
	}
	
	if (field == "sell") {
		return	Number(document.forms["trade"]["sell-gold"].value) * 10000 +
				Number(document.forms["trade"]["sell-silver"].value) * 100 +
				Number(document.forms["trade"]["sell-copper"].value);
	}
	
}

function toGSC(val, useSpan) {

	if (useSpan) {
		var openG = "<span class=\"gold\">";	var closeG = "</span>";
		var openS = "<span class=\"silver\">";	var closeS = "</span>";
		var openC = "<span class=\"copper\">";	var closeC = "</span>";
	} else {
		var openG = "";	var closeG = "g";
		var openS = "";	var closeS = "s";
		var openC = "";	var closeC = "c";
	}

	var sign = (val < 0 ? -1 : 1);
	var g = Math.floor(sign * val / 10000);
	var s = Math.floor((sign * val - g * 10000) / 100);
	var c = sign * val - g * 10000 - s * 100;
	
	
	if (g) return openG + (sign * g) + closeG + 
				  openS + s + closeS +
				  openC + c + closeC;
	if (s) return openS + (sign * s) + closeS +
				  openC + c + closeC;
	if (c) return openC + (sign * c) + closeC;
	return openC + "0" + closeC;
	
}

function fix() {
	
	var quantity = document.forms["trade"]["quantity"];
	var buyCopper = document.forms["trade"]["buy-copper"];
	var buySilver = document.forms["trade"]["buy-silver"];
	var buyGold = document.forms["trade"]["buy-gold"];
	var sellCopper = document.forms["trade"]["sell-copper"];
	var sellSilver = document.forms["trade"]["sell-silver"];
	var sellGold = document.forms["trade"]["sell-gold"];
	
	// numeric characters only
	if (quantity.value != quantity.value.replace(/[^0-9]/g, '')) 
		quantity.value = quantity.value.replace(/[^0-9]/g, ''); 
	if (buyCopper.value != buyCopper.value.replace(/[^0-9]/g, '')) 
		buyCopper.value = buyCopper.value.replace(/[^0-9]/g, ''); 
	if (buySilver.value != buySilver.value.replace(/[^0-9]/g, '')) 
		buySilver.value = buySilver.value.replace(/[^0-9]/g, ''); 
	if (buyGold.value != buyGold.value.replace(/[^0-9]/g, '')) 
		buyGold.value = buyGold.value.replace(/[^0-9]/g, ''); 
	if (sellCopper.value != sellCopper.value.replace(/[^0-9]/g, '')) 
		sellCopper.value = sellCopper.value.replace(/[^0-9]/g, ''); 
	if (sellSilver.value != sellSilver.value.replace(/[^0-9]/g, '')) 
		sellSilver.value = sellSilver.value.replace(/[^0-9]/g, ''); 
	if (sellGold.value != sellGold.value.replace(/[^0-9]/g, '')) 
		sellGold.value = sellGold.value.replace(/[^0-9]/g, '');
		
	// convert currencies
	if (buyCopper.value > 99 && (document.activeElement != buyCopper)) {
		buySilver.value = Math.floor(buyCopper.value / 100);
		buyCopper.value -= buySilver.value * 100;
		if (buySilver.value < 100) buyGold.value = "";
	}

	if (buySilver.value > 99 && (document.activeElement != buySilver)) {
		buyGold.value = Math.floor(buySilver.value / 100);
		buySilver.value -= buyGold.value * 100;
	}
	
	if (sellCopper.value > 99 && (document.activeElement != sellCopper)) {
		sellSilver.value = Math.floor(sellCopper.value / 100);
		sellCopper.value -= sellSilver.value * 100;
		if (sellSilver.value < 100) sellGold.value = "";
	}

	if (sellSilver.value > 99 && (document.activeElement != sellSilver)) {
		sellGold.value = Math.floor(sellSilver.value / 100);
		sellSilver.value -= sellGold.value * 100;
	}	
}