angular.module("app").directive("contextmenu",function(e){return{restrict:"E",scope:{items:"=",x:"@",y:"@",deleteobj:"&",configureobj:"&",textmenu:"@"},template:'<div id="contextmenudiv" style="display:block;left:{{x}}px;top:{{y}}px"><ul class="dropdown-menu" role="menu" style="display:block;position:static;" ><li ng-repeat="x in items" id="li_{{x}}"> <a tabindex="-1" id="{{x}}">{{x}}</a> </li>',link:function(n,l){if(console.log("scope:",n),l.css({left:n.x,top:n.y}),"true"==textmenu){var t=(l.children(),"");t+='<li role="separator" class="divider"></li>',t+='<li class="dropdown dropdown-submenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Font Size</a>',t+='   <ul class="dropdown-menu sub-menu">',t+='     <li><a id="Large" tabindex="-1">Large</a></li>',t+='     <li><a id="Medium" tabindex="-1">Medium</a></li>',t+='     <li><a id="Small" tabindex="-1">Small</a></li>',t+="   </ul>",t+="</li>",t+='<li class="dropdown dropdown-submenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Font Family</a>',t+='   <ul class="dropdown-menu sub-menu">',t+='     <li><a id="Arial" tabindex="-1">Arial</a></li>',t+='     <li><a id="Sans-Serif" tabindex="-1">Sans-Serif</a></li>',t+='     <li><a id="Rockwell" tabindex="-1">Rockwell</a></li>',t+="   </ul>",t+="</li>";var i=angular.element(t);l.children(":first").children(":first").append(e(i)(n)),console.log("Elements: ",l),console.log("Vals: ",l.children(":first").children(":first"))}n.$watch(function(){return l.find("a").length},function(){n.$evalAsync(function(){var e=l.find("a");console.log("child: ",e);var t=document.getElementById("Send Backward"),i=angular.element(t);i.bind("click",function(){sendBackward()});var a=document.getElementById("Send To Back"),o=angular.element(a);o.bind("click",function(){sendToBack()});var c=document.getElementById("Bring To Front"),d=angular.element(c);d.bind("click",function(){bringToFront()});var r=document.getElementById("Bring Forward"),u=angular.element(r);u.bind("click",function(){bringToFront()});var m=document.getElementById("Change Color");if(null!==m){var g=angular.element(m);g.bind("click",function(){activateColorPicker(""),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1})}var s=document.getElementById("Delete"),f=angular.element(s);f.bind("click",function(){console.log("Delete clicked"),n.deleteobj()});var b=document.getElementById("Configure");if(null!==b){var k=angular.element(b);k.bind("click",function(){console.log("Configure clicked"),n.configureobj()})}if("true"==n.textmenu){var p=document.getElementById("Large"),v=angular.element(p);v.bind("click",function(){changeFontSize(24)});var y=document.getElementById("Medium"),x=angular.element(y);x.bind("click",function(){changeFontSize(12)});var w=document.getElementById("Small"),B=angular.element(w);B.bind("click",function(){changeFontSize(6)});var h=document.getElementById("Arial"),F=angular.element(h);F.bind("click",function(){changeFontFamily("arial black")});var E=document.getElementById("Sans-Serif"),S=angular.element(E);S.bind("click",function(){changeFontFamily("sans-serif")});var I=document.getElementById("Rockwell"),j=angular.element(I);j.bind("click",function(){changeFontFamily("rockwell")})}})})}}});