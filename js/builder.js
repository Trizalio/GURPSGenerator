
var build = {};
/*var MainStats = ["ST", "DX", "IQ", "HT"];

var SecondryStats = ["HP", "BasicLift", "DmgTrust", "DmgSwing","BasicSpeed", "BasicMove", "Dodge",
"Will", "Perception", "Parry","FP", "Jump", "Block"];

var Params = ["Value", "Base", "Bonus", "Temp", "Cost", "ValueDiv", "CostDiv"];
var Type = ["Text", "Box"];*/

build.initDone = false;
build.currentStat = 0;
build.CodeHolder = "myCode";
build.TabButtonHolder = "myTab";
build.TabContentHolder = "myTabContent";

function stat (Parent, StatName, StatFunction, CostPerPoint, Parents){
    //console.log("init " + StatName);
    build[StatName] = this;
	this.StatValue = 0;
	this.StatBase = 0;
	this.StatBonus = 0;
	this.StatTemp = 0;
    this.StatCost = 0;
    this.CostPerPoint = CostPerPoint;

	this.Parents = Parents;
    for(var i in this.Parents)
    {
        build[this.Parents[i]].AddChild(this);
    }
	this.children = [];

    //this.Div = document.getElementById(StatName);
    this.Div = document.createElement('tr');
    Parent.appendChild(this.Div);

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
        build[StatName].SlotOpen = "Value";
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
    this.DivCost.onclick = function(){
        build[StatName].ShowCostBox();
        build[StatName].SlotOpen = "Cost";
        console.log(build[StatName].SlotOpen);
    }
	temp.appendChild(this.DivCost);

    this.DivCostBox = document.createElement('input');
    this.DivCostBox.value = "cost";
    this.DivCostBox.style = "display:none";
    this.DivCostBox.onmousedown = function(){
        if(build && build.currentStat){
            build.DoNotHide = true;
        }
    }
    temp.appendChild(this.DivCostBox);

    this.SlotOpen = 0;


    this.CodeHolder = document.getElementById(build.CodeHolder);
    this.Code = document.createElement('script');
    this.Code.innerHTML = "build."+StatName+".CalculateBase = function(){this.StatBase = " + StatFunction +";}"

    this.CodeHolder.appendChild(this.Code);

    this.CostFor = function(value){
        if(value > 0){
            return 10;
        }else{
            return 5;
        }
    }

    this.CalculateCost = function(){
        this.StatCost = 0;

        for(var i = 0; i < this.StatBonus; ++i)
        {
            this.StatCost += this.CostFor(this.StatBonus);
        }
        for(var i = 0; i > this.StatBonus; ++i)
        {
            this.StatCost -= this.CostFor(this.StatBonus);
        }
    }
    this.CalculateBonus = function(){
        this.StatBonus = 0;


        for(var i = this.StatCost; i < 0; ++i)
        {
            i += this.CostFor(this.StatBonus);
            --this.StatBonus;
        }
        for(var i = this.StatCost; i > this.CostFor(this.StatBonus); ++i)
        {
            i -= this.CostFor(this.StatBonus);
            ++this.StatBonus;
        }
    }

    this.AddChild = function(target){
        this.children.push(target);
    }
    this.ShowBox = function(){
        build.currentStat = this;
        this.DivValueBox.style = "display:initial";
        this.DivValueBox.value = this.Value();
        this.DivValue.style = "display:none";
    }
    this.ShowCostBox = function(){
        build.currentStat = this;
        this.DivCostBox.style = "display:initial";
        this.DivCostBox.value = this.Value();
        this.DivCost.style = "display:none";
    }

    this.HideBox = function(){
        console.log("this.HideBox " + this.SlotOpen);
        if(this.SlotOpen == "Value")
        {
            this.DivValueBox.style = "display:none";
            this.DivValue.style = "display:initial";
            var newValue = parseInt(this.DivValueBox.value, 10);
            if(newValue >= 0)
            {
                this.SetValue(newValue);
            }
        }
        else if(this.SlotOpen == "Cost")
        {
            this.DivCostBox.style = "display:none";
            this.DivCost.style = "display:initial";
            var newValue = parseInt(this.DivCostBox.value, 10);
            if(newValue >= 0)
            {
                this.SetCost(newValue);
            }
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
        this.CalculateValue();
        this.CalculateCost();
    }
    this.SetCost = function(targetValue){
        this.StatCost = targetValue;
        this.CalculateBonus();
        this.CalculateValue();
    }
    this.CalculateValue = function(){
        this.CalculateBase();
        this.StatValue = this.StatBase + this.StatBonus + this.StatTemp;
        this.output();
        for(var i in this.children){
            this.children[i].CalculateValue();
        }
    }
    this.output = function(){
        this.DivValue.innerHTML = this.StatValue;
        this.DivCost.innerHTML = this.StatCost;
    }
    this.CalculateValue();

}
function tab(TabName, TabId){
    this.TabButtonHolder = document.getElementById(build.TabButtonHolder);
    this.TabButton = document.createElement('li');

    this.TabLink = document.createElement('a');
    this.TabLink.setAttribute("data-toggle","tab");
    this.TabLink.href = "#" + TabId;
    this.TabLink.innerHTML = TabName;

    this.TabButton.appendChild(this.TabLink);
    this.TabButtonHolder.appendChild(this.TabButton);


    this.TabContentHolder = document.getElementById(build.TabContentHolder);

    this.TabContent = document.createElement('div');
    this.TabContent.id = TabId;
    //this.TabContent.innerHTML = "213";
    this.TabContent.setAttribute("class","tab-pane");
    this.TabContentHolder.appendChild(this.TabContent);

    this.getDivToLink = function(){
        return this.TabContent;
    }

}
function holder(Parent, Name, Size){
    this.Parent = Parent;

    this.Holder = document.createElement('div');
    this.Holder.setAttribute("class", "col-xs-12 col-sm-"+Size+" sidebar-offcanvas");
    //this.Holder.id = "sidebar";
    this.Parent.appendChild(this.Holder);

    this.Panel = document.createElement('div');
    this.Panel.setAttribute("class", "panel panel-default");
    this.Holder.appendChild(this.Panel);

    this.PanelHeading = document.createElement('div');
    this.PanelHeading.setAttribute("class", "panel-heading");
    this.PanelHeading.innerHTML = Name;
    this.Panel.appendChild(this.PanelHeading);

    this.Table = document.createElement('table');
    this.Table.setAttribute("class", "table");
    this.Panel.appendChild(this.Table);

    this.getDivToLink = function(){
        return this.Table;
    }
}
function init()
{
    var newTab = new tab("Тест", "testid");
    var newHolder = new holder(newTab.getDivToLink(), "Новые параметры", 3);
    new stat(newHolder.getDivToLink(), "ST", 10, 10, []);
    new stat(newHolder.getDivToLink(), "DX", 10, 10, []);
    new stat(newHolder.getDivToLink(), "IQ", 10, 10, []);
    new stat(newHolder.getDivToLink(), "HT", "build.ST.Value() + build.DX.Value()", 10, ["ST", "DX"]);
    //new code("this.statBase + 1");
    //new stat("DX", 10, 20);
    //new stat("IQ", 10, 20);
    //new stat("HT", "build.ST.Value() + build.DX.Value()", 10);
}

function checkInit()
{
    console.log("overview");
	if(build.initDone == false){
    	init();
    	build.initDone = true;
	}
}