function configuratorProduct(e,n,o){log.info("Entering configuratorProduct"),popup=window.open("/companies/"+n+"/prices/"+e+"/productconfig.html?searchId="+o,"Popup","width=300,height=500"),popup.focus(),log.info("Leaving configuratorProduct")}function loadConfigScreen(e,n,o){if(jsondata=e,log.info("Entering loadConfigScreen"),log.trace("jsondata: ",jsondata),"Data Not Found"==jsondata.error)document.getElementById("data").innerHTML+="<br>"+jsondata.error;else{jsondataprice=JSON.parse(jsondata.price),version=JSON.parse(jsondata.version);var t=document.createElement("div");t.className="form-group form-group-sm";var r=document.createElement("div");for(r.className="control-label col-sm-3",r.innerHTML+=jsondata.name,t.appendChild(r),document.getElementById("data").appendChild(t),i=0;i<jsondataprice.product.options.length;i++){var a=document.createElement("div");a.className="form-group form-group-sm";var c=document.createElement("label");c.className="control-label col-sm-3",c.innerHTML+=jsondataprice.product.options[i].opname,a.appendChild(c);var d=document.createElement("div");d.className="control-label col-sm-9";var s="",l="select"+i;for(s='<select class="form-control input-sm" id="'+l+'">',j=0;j<jsondataprice.product.options[i].selections.length;j++)s+='<option value=\'{"code":"',s+=jsondataprice.product.options[i].selections[j].code,s+='","price":"',s+=jsondataprice.product.options[i].selections[j].price,s+="\"}'",n&&jsondataprice.product.options[i].selections[j].code==o[i+1]&&(s+=' selected="selected" '),s+=">",s+=jsondataprice.product.options[i].selections[j].description,s+="</option>";s+="</select>",d.innerHTML+=s,a.appendChild(d),document.getElementById("data").appendChild(a)}var a=document.createElement("div");a.className="form-group form-group-sm";var c=document.createElement("label");c.className="control-label col-sm-3",c.innerHTML+="Configuration: ",a.appendChild(c);var p=document.createElement("div");p.className="col-sm-9 input-sm";var d=document.createElement("p");d.className="pull-left",d.id="prodconfig",p.appendChild(d),a.appendChild(p),document.getElementById("data").appendChild(a);var m=document.createElement("div");m.className="form-group form-group-sm";var c=document.createElement("label");c.className="control-label col-sm-3",c.innerHTML+="List Price: ",m.appendChild(c);var p=document.createElement("div");p.className="col-sm-9 input-sm";var d=document.createElement("p");d.className="pull-left",d.id="price",p.appendChild(d),m.appendChild(p),document.getElementById("data").appendChild(m);var u=document.createElement("div");u.innerHTML+="Price Version: ";var g=document.createElement("label");g.setAttribute("id","priceversion"),g.innerHTML+=version,u.style.visibility="hidden",u.appendChild(g),document.getElementById("data").appendChild(u);var v=canvas.item(searchId).config;for(configString(jsondata,searchId),version!=canvas.item(searchId).priceversion&&("undefined"==v&&0==jsondataprice.product.options.length?changeVersion(version,searchId):0==jsondataprice.product.options.length?(document.getElementById("price").innerHTML+="- Please Note Price Has been Updated",d.style.color="red",changeVersion(version,searchId)):"undefined"==v?(document.getElementById("price").innerHTML+="- Please Configure",d.style.color="blue",changeVersion(version,searchId)):(document.getElementById("price").innerHTML+="- Invalid Price, Please Adjust Configuration",d.style.color="red")),log.debug("Adding Listeners: Before For Loop"),i=0;i<jsondataprice.product.options.length;i++){var l="select"+i;document.getElementById(l).onchange=function(){var e=this.selectedIndex,n=this.children[e].innerHTML.trim();log.trace(n),configString(jsondata,searchId),changeVersion(version,searchId),version==canvas.item(searchId).priceversion&&(d.style.color="black")}}}$("#gifspinner").fadeOut(400),log.info("Leaving loadConfigScreen")}function configString(e,n){log.info("Entering configString"),log.trace("configString:jasontext",e),jsondataprice=JSON.parse(e.price),log.trace("configString:jsondataprice",jsondataprice);var o=jsondataprice.product.name,t=jsondataprice.product.basePrice;for(i=0;i<jsondataprice.product.options.length;i++){selectid="select"+i;var r=document.getElementById(selectid).selectedIndex;o+="-";var a=JSON.parse(document.getElementById(selectid).children[r].value);o+=a.code,t=parseInt(t)+parseInt(a.price)}document.getElementById("prodconfig").innerHTML=o,document.getElementById("price").innerHTML=t,canvas.item(n).setConfig(document.getElementById("prodconfig").innerHTML),canvas.item(n).price=document.getElementById("price").innerHTML,canvas.renderAll(),log.info("Leaving configString")}function changeVersion(e,n){canvas.item(n).priceversion=e,canvas.renderAll()}var popup;