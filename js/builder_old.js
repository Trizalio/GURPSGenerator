
var build = {};
/*var MainStats = ["ST", "DX", "IQ", "HT"];

var SecondryStats = ["HP", "BasicLift", "DmgTrust", "DmgSwing","BasicSpeed", "BasicMove", "Dodge",
"Will", "Perception", "Parry","FP", "Jump", "Block"];

var Params = ["Value", "Base", "Bonus", "Temp", "Cost", "ValueDiv", "CostDiv"];
var Type = ["Text", "Box"];*/

var build.initDone = false;

var build.currentStat = 0;

var build.tabName = "myTab";

function stat (StatName, StatBase, CostPerPoint){
    console.log("init " + StatName);
    build[StatName] = this;
	this.StatValue = 0;
	this.StatBase = StatBase;
	this.StatBonus = 0;
	this.StatTemp = 0;
    this.StatCost = 0;
    this.CostPerPoint = CostPerPoint;

	this.parents = [];
	this.children = [];

	this.Div = document.getElementById(StatName);
    this.Div.style = "height:50px"

    //name
	var temp = document.createElement('td');
	this.Div.appendChild(temp);
	temp.innerHTML = StatName;
	
    //value text and box
	temp = document.createElement('td');
	this.Div.appendChild(temp);

	this.DivValue = document.createElement('div');
	this.DivValue.innerHTML = "value";
    this.DivValue.onclick = function(){
        build[StatName].ShowBox();
    }
    temp.appendChild(this.DivValue);

    this.DivValueBox = document.createElement('input');
    this.DivValueBox.value = "cost";
    this.DivValueBox.style = "display:none";
    this.DivValueBox.onmousedown = function(){
        if(build && build.currentStat){
            build.DoNotHide = true;
        }
    }
    document.onmousedown = function(){
        if(build && build.currentStat){
            if(build.DoNotHide){
                build.DoNotHide = false;
            }else{
                build.currentStat.HideBox();
            }
        }
    }
	temp.appendChild(this.DivValueBox);

    //cost text and box
	temp = document.createElement('td');
	this.Div.appendChild(temp);
	this.DivCost = document.createElement('div');
	this.DivCost.innerHTML = "cost";
	temp.appendChild(this.DivCost);

    console.log(this);

    this.ShowBox = function(){
        build.currentStat = this;
        this.DivValueBox.style = "display:initial";
        this.DivValueBox.value = this.Value();
        this.DivValue.style = "display:none";
    }

    this.HideBox = function(){
        build.currentStat = this;
        this.DivValueBox.style = "display:none";
        this.DivValue.style = "display:initial";
        var newValue = parseInt(this.DivValueBox.value, 10);
        console.log(newValue);
        if(newValue >= 0)
        {
            this.SetValue(newValue);
        }
    }

    this.Value = function(){
        return this.StatValue;
    }

    this.Cost = function(){
        return this.StatCost;
    }
    this.SetValue = function(targetValue){
        this.StatBonus +=  targetValue - this.StatValue;
        this.calculateValue();
    }
    this.calculateValue = function(){
        this.StatValue = this.StatBase + this.StatBonus + this.StatTemp;
        this.StatCost = this.CostPerPoint * this.StatBonus;
        this.output();
        for(var i in this.children){
            this.children[i].calculateValue();
        }
    }
    this.output = function(){
        this.DivValue.innerHTML = this.StatValue;
        this.DivCost.innerHTML = this.StatCost;
    }

    this.calculateValue();
}
function tab(tabName){
    this.Div = document.getElementById(build.tabName);
}

/*function edit(divId, divClass){
	var text = document.getElementById(divId);
	var box = document.getElementById(divId+"_Box");

	text.style = "display:none";
	box.style = "display:initial";

	box.value = text.innerHTML;

	if(currentStat){
		set(divClass);	
	}
	currentStat = divId;
}

function set(divClass){
	var text = document.getElementById(currentStat);
	var box = document.getElementById(currentStat+"_Box");

	text.style = "display:initial";
	box.style = "display:none";

	build[currentStat] = box.value;

	if(divClass == "Cost"){
		calculateStatsFromCost();
	}else if(divClass == "Value"){
		calculateCostFromStats();
	}
	console.log(build);
	outputValues();

	currentStat = 0;
}

function initMainStats(){
    for(var i in MainStats){
    	build[MainStats[i] + "_Bonus"] = 0;
    	build[MainStats[i] + "_Temp"] = 0;
    }
    build["ST_Base"] = 10;
    build["DX_Base"] = 10;
    build["IQ_Base"] = 10;
    build["HT_Base"] = 10;
    for(var i in MainStats){
    	build[MainStats[i] + "_Bonus"] = 0;
    	build[MainStats[i] + "_Temp"] = 0;
    }
	checkMainStats();
}
function initSecondryStats(){
    for(var i in SecondryStats){
    	build[SecondryStats[i] + "_Bonus"] = 0;
    	build[SecondryStats[i] + "_Temp"] = 0;
    }
    build["HP_Base"] = build["ST_Value"];
    build["BasicLift_Base"] = 2 * build["ST_Value"] * build["ST_Value"] / 10;
    build["DmgTrust_Base"] = undef;
    build["DmgSwing_Base"] = undef;
    build["BasicSpeed_Base"] = (build["HT_Value"] + build["DX_Value"]) / 4;
	checkSecondryStats();
    build["BasicMove_Base"] = Math.floor(build["BasicSpeed_Value"]);
	checkSecondryStats();
    build["Dodge_Base"] = 3 + build["BasicSpeed_Value"];
    build["Will_Base"] = build["IQ_Value"];
    build["Perception_Base"] = build["IQ_Value"];
    build["Parry_Base"] = undef;
    build["FP_Base"] = build["HT_Value"];
    build["Jump_Base"] = undef;
    build["Block_Base"] = undef;
	checkSecondryStats();
}
function calculateCostFromStats(){
    for(var i in MainStats){
    	build[MainStats[i]+"_Cost"] = build[MainStats[i]+"_Bonus"]*2;
    }
    for(var i in SecondryStats){
    	build[SecondryStats[i]+"_Cost"] = build[SecondryStats[i]+"_Bonus"]*3;
    }
}
function calculateStatsFromCost(){
    for(var i in MainStats){
    	build[MainStats[i]+"_Bonus"] = build[MainStats[i]+"_Cost"]*2;
    }
    for(var i in SecondryStats){
    	build[SecondryStats[i]+"_Bonus"] = build[SecondryStats[i]+"_Cost"]*3;
    }
}
function init(){
	initMainStats();
	initSecondryStats();
	calculateCostFromStats();
	initOutputValues();
	console.log(build);
	outputValues();
}
function initOutputValues(){
    for(var i in MainStats){
    	build[MainStats[i]+"_ValueDiv"] = document.getElementById(MainStats[i]+"_Value");
    }
    for(var i in MainStats){
    	build[MainStats[i]+"_CostDiv"] = document.getElementById(MainStats[i]+"_Cost");
    }
    for(var i in SecondryStats){
    	build[SecondryStats[i]+"_ValueDiv"] = document.getElementById(SecondryStats[i]+"_Value");
    }
    for(var i in SecondryStats){
    	build[SecondryStats[i]+"_CostDiv"] = document.getElementById(SecondryStats[i]+"_Cost");
    }
}
function outputValues(){
    for(var i in MainStats){
    	if(build[MainStats[i]+"_ValueDiv"])
    	build[MainStats[i]+"_ValueDiv"].innerHTML = build[MainStats[i]+"_Value"] + "(" + 
    					(build[MainStats[i]+"_Base"] + build[MainStats[i]+"_Bonus"]) + ")";
    	if(build[MainStats[i]+"_CostDiv"])
    	build[MainStats[i]+"_CostDiv"].innerHTML = build[MainStats[i]+"_Cost"];
    }
    for(var i in SecondryStats){
    	if(build[SecondryStats[i]+"_ValueDiv"])
    	build[SecondryStats[i]+"_ValueDiv"].innerHTML = build[SecondryStats[i]+"_Value"] + "(" + 
    					(build[SecondryStats[i]+"_Base"] + build[SecondryStats[i]+"_Bonus"]) + ")";
    	if(build[SecondryStats[i]+"_CostDiv"])
    	build[SecondryStats[i]+"_CostDiv"].innerHTML = build[SecondryStats[i]+"_Cost"];
    }
}
function checkAll(){
	checkMainStats();
	checkSecondryStats();
}
function checkMainStats(){
	for(var i in MainStats){
    	build[MainStats[i] + "_Value"] = build[MainStats[i] + "_Base"] + 
    				build[MainStats[i] + "_Bonus"] + build[MainStats[i] + "_Temp"];
	}
}
function checkSecondryStats(){
	for(var i in SecondryStats){
    	build[SecondryStats[i] + "_Value"] = build[SecondryStats[i] + "_Base"] + 
    				build[SecondryStats[i] + "_Bonus"] + build[SecondryStats[i] + "_Temp"];
	}
}*/
function init()
{
    new stat("ST", 10, 10);
    new stat("DX", 10, 20);
    new stat("IQ", 10, 20);
    new stat("HT", 10, 10);
}

function checkInit()
{
    console.log("overview");
	if(build.initDone == false){
    	init();
    	build.initDone = true;
	}
}
/*function skills()
{
    console.log("skills");
	if(build.initDone == false){
    	init();
    	initDone = true;
	}
}
function advantages()
{
    console.log("advantages");
	if(initDone == false){
    	init();
    	initDone = true;
	}
}
function disadvantages()
{
    console.log("disadvantages");
	if(initDone == false){
    	init();
    	initDone = true;
	}
}*/