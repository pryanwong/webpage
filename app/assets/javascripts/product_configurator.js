var popup;
function configuratorProduct(productId, companyId, searchId) {
   log.info( "Entering configuratorProduct");
   popup = window.open("/companies/" + companyId + "/prices/" + productId + "/productconfig.html?searchId=" + searchId, "Popup", "width=300,height=500");
   popup.focus();
   log.info( "Leaving configuratorProduct");
}

function loadConfigScreen( data, selectChoices, splitVals ) {
   jsondata = data;
   log.info( "Entering loadConfigScreen");
   log.trace("jsondata: ", jsondata)
   if (jsondata.error == "Data Not Found") {
      document.getElementById('data').innerHTML += '<br>' + jsondata.error;
   }
   else {
     jsondataprice = JSON.parse(jsondata.price);
     version = JSON.parse(jsondata.version)
     //document.getElementById('data').innerHTML += '<br>' + jsondata['name'];
     var prodName = document.createElement('div')
     prodName.className = 'form-group form-group-sm';
     var prodName2 = document.createElement('div');
     prodName2.className = 'control-label col-sm-3';
     prodName2.innerHTML += jsondata['name'];
     prodName.appendChild(prodName2);
     document.getElementById('data').appendChild(prodName);
     for (i=0; i< jsondataprice.product.options.length; i++) {
        var newNode = document.createElement('div');
        newNode.className = 'form-group form-group-sm';
        var newNode2 = document.createElement('label');
        newNode2.className = 'control-label col-sm-3';
        newNode2.innerHTML += jsondataprice.product.options[i].opname
        newNode.appendChild(newNode2)
        var newNode3 = document.createElement('div');
        newNode3.className = 'control-label col-sm-9';
        var selectHTML = "";
        var selectid = 'select' + i
        selectHTML='<select class="form-control input-sm" id="' + selectid + '">';
        for (j=0; j< jsondataprice.product.options[i].selections.length; j++) {
           selectHTML += '<option value=\'{"code":"'
           selectHTML += jsondataprice.product.options[i].selections[j].code
           selectHTML += '","price":"'
           selectHTML += jsondataprice.product.options[i].selections[j].price
           selectHTML +='"}\''
           if (selectChoices) {
             if (jsondataprice.product.options[i].selections[j].code == splitVals[i+1]) {
                selectHTML +=' selected="selected" '
             }
           }
           selectHTML += '>'
           selectHTML +=jsondataprice.product.options[i].selections[j].description
           selectHTML +='</option>'
        }
        selectHTML += "</select>";
        newNode3.innerHTML += selectHTML
        newNode.appendChild(newNode3);

        document.getElementById('data').appendChild(newNode);

   }
   // Configuration
   var newNode = document.createElement('div');
   newNode.className = 'form-group form-group-sm';
   var newNode2 = document.createElement('label');
   newNode2.className = 'control-label col-sm-3';
   newNode2.innerHTML += "Configuration: "
   newNode.appendChild(newNode2)
   var newNodeDiv = document.createElement('div');
   newNodeDiv.className = "col-sm-9 input-sm";
   var newNode3 = document.createElement('p');
   newNode3.className = 'pull-left';
   newNode3.id = "prodconfig"
   newNodeDiv.appendChild(newNode3);
   newNode.appendChild(newNodeDiv);
   document.getElementById('data').appendChild(newNode);

   // List Price
   var newPriceNode = document.createElement('div');
   newPriceNode.className = 'form-group form-group-sm';
   var newNode2 = document.createElement('label');
   newNode2.className = 'control-label col-sm-3';
   newNode2.innerHTML += "List Price: "
   newPriceNode.appendChild(newNode2)
   var newNodeDiv = document.createElement('div');
   newNodeDiv.className = "col-sm-9 input-sm";
   var newNode3 = document.createElement('p');
   newNode3.className = 'pull-left';
   newNode3.id = "price"
   newNodeDiv.appendChild(newNode3);
   newPriceNode.appendChild(newNodeDiv);

   document.getElementById('data').appendChild(newPriceNode);

   var newNode4 = document.createElement('div');
   newNode4.innerHTML += "Price Version: "
   var newNode5 = document.createElement('label');
   console.log(version)
   newNode5.setAttribute("id","priceversion");
   newNode5.innerHTML += version;
   newNode4.style.visibility = "hidden";
   newNode4.appendChild(newNode5);
   document.getElementById('data').appendChild(newNode4);
   var initialConfig = canvas.item(searchId).config
   configString(jsondata,searchId)
   console.log("Config: ", initialConfig)
   if (version != canvas.item(searchId).priceversion) {
     if (initialConfig == 'undefined') {
       document.getElementById('price').innerHTML += "- Please Configure"
       newNode3.style.color = "blue";
       changeVersion(version, searchId);
     } else {
       document.getElementById('price').innerHTML += "- Invalid Price, Please Adjust Configuration"
       newNode3.style.color = "red";
     }
   }

   // done configuration
   log.debug("Adding Listeners: Before For Loop")
   for (i=0; i< jsondataprice.product.options.length; i++) {
      var selectid = 'select' + i
      document.getElementById(selectid).onchange = function() {
            var index = this.selectedIndex;
            var inputText = this.children[index].innerHTML.trim();
            log.trace(inputText);
            configString(jsondata,searchId);
            changeVersion(version, searchId);
            if (version == canvas.item(searchId).priceversion) {
              newNode3.style.color = "black";
            }
      }
    }
   }
   $('#gifspinner').fadeOut( 400 );
   log.info( "Leaving loadConfigScreen");
}

function configString(jsontext,searchId) {
  log.info( "Entering configString");
  log.trace ("configString:jasontext", jsontext);
  jsondataprice = JSON.parse(jsontext.price);
  log.trace("configString:jsondataprice", jsondataprice);
  var configurationString = jsondataprice.product.name;
  var priceString = "List Price: $";
  var listPrice = jsondataprice.product.basePrice;
  for (i=0; i< jsondataprice.product.options.length; i++) {
       selectid = 'select' + i
       var index = document.getElementById(selectid).selectedIndex
       configurationString += '-'
       var values = JSON.parse(document.getElementById(selectid).children[index].value)
       configurationString += values.code
       listPrice = parseInt(listPrice) + parseInt(values.price)
  }
  document.getElementById('prodconfig').innerHTML = configurationString
  document.getElementById('price').innerHTML = listPrice
  canvas.item(searchId).setConfig(document.getElementById('prodconfig').innerHTML)
  canvas.item(searchId).price = document.getElementById('price').innerHTML
  canvas.renderAll();
  log.info( "Leaving configString");
}

function changeVersion(version, searchId) {
  canvas.item(searchId).priceversion = version;
  canvas.renderAll();
}
