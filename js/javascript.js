
var map1 = new L.Map('map', { 
  layer:[all, spanish, frenchCreole, italian, russian, chinese, korean],
  center: [40.7127,-74.0059],
  zoom: 11
});

// var sidebar = L.control.sidebar('sidebar').addTo(map1);

// L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
// }).addTo(map1);

L.tileLayer('https://api.mapbox.com/styles/v1/zhoujh42/cishmoep8000c2ym30mtsm5o0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemhvdWpoNDIiLCJhIjoiY2VkNGU4OGE1YjEwODMxODUyMmUzNjYwZjQyOWNkODMifQ.55ZHYWs5RP3CfpIyrmOisQ').addTo(map1);

var info = L.control({position: 'bottomleft'});
var infoClick = L.control({position: 'bottomleft'});
var legend = L.control({position: 'bottomleft'});
// window.top = 0;

//add Community District Boundary
var nycd = L.geoJson(nycdData, {style: nycdStyle}).addTo(map1);

function nycdStyle(feature) {
  return {
  weight: 3,
  opacity: 1,
  dashArray: '5',
  color: 'black'
  };
}


//default All layer

var all = L.geoJson(mapData, {style: allStyle, onEachFeature: onEachFeatureAll}).addTo(map1);

info.updateAll = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getAllColor(props.lgoenglepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b>'
    // + '</b><br />' + "All - Speak English Less Than 'Very Well'  <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgoenglepp + '%</h5>') 
    : '<h5>Hover over a Neighborhood</h5>');
};

//language_top, language_second, language_pct_top, language_pct_moe_top

infoClick.updateAll = function (props) {

  this._div.innerHTML =  (props ?   
    // '<i style="background:' + getAllColor(props.lgoenglepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br/><br/>Speak English Less Than "Very Well"'  
    // + (props.bndrytype != 'NTA' ? 'N/A' : props.language_top + '</b><br /><h5>' +  top + '%' + '  +/-  ' + props.language_pct_moe_top + '%</h5>') 
    + (props.bndrytype != 'NTA' ? '<br/><br/><br/>The neighborhood you are looking for <br/>does not have data available.' : '<br/><b>' + 'Total: </b>' + props.lgoenglepp + '%<br/><br/>Top Languages<br/>'
    + '<div id="ntaChart"><svg width="400" height="290"></svg></div>'
    // + '<b>' + props.language_top.split("-")[0] + ': </b>' + ((props.language_pct_top)*100).toFixed(1) + '%<br/>'
    // + '<b>' + props.language_second.split("-")[0] + ': </b>' + ((props.language_pct_second)*100).toFixed(1) + '%<br/>'
    // + '<b>' + props.language_third.split("-")[0] + ': </b>' + ((props.language_pct_third)*100).toFixed(1) + '%<br/>'
    // + '<b>' + props.language_fourth.split("-")[0] + ': </b>' + ((props.language_pct_fourth)*100).toFixed(1) + '%<br/>'
    // + '<b>' + props.language_fifth.split("-")[0] + ': </b>' + ((props.language_pct_fifth)*100).toFixed(1) + '%<br/>'

    ) : '</br></br></br></br></br></br><h5>Click a Neighborhood</h5>');

};

function getAllColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 10 ? '#fef0d9':
  d <= 25 ? '#fdcc8a':
  d <= 50 ? '#fc8d59':
  '#d7301f';
}

function allStyle(feature) {
  return {
  fillColor: getAllColor(feature.properties.lgoenglepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureAll(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightAll,
        click: zoomToFeatureAll
    });
}

function highlightFeatureAll(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateAll(layer.feature.properties);
} 

function resetHighlightAll(e) {
    all.resetStyle(e.target);
}


function zoomToFeatureAll(e) {
    var layer = e.target;
    // map1.fitBounds(layer.getBounds());
    layer.setStyle({
        weight: 3,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.6
    });
    props = layer.feature.properties;
    infoClick.updateAll(props);

    nv.addGraph(function() {
    var ntaChart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })    //Specify the data accessors.
        .y(function(d) { return d.value })
        .wrapLabels(true)
        // .tooltips(false)        //Don't show tooltips
        .showValues(true)       //...instead, show the bar value right on top of each bar.
        .showYAxis(false)
        .duration(500)
        .margin({left:10,right:10})
        // .width(222)
        .color(['rgb(27,158,119)','rgb(217,95,2)','rgb(117,112,179)','rgb(231,41,138)'])
        .valueFormat(function(d){
          return d + "%";
        })
        // .rotateLabels(-20)
        // .showlegend(true)
        // .tooltips=(false)
        ;

    d3.select('#ntaChart svg')
        .datum(exampleData())
        .call(ntaChart);

    nv.utils.windowResize(ntaChart.update);

    return ntaChart;
  });

  //Each bar represents a single discrete quantity.
  function exampleData() {
   return  [ 
      {
        key: "Cumulative Return",
        values: [
          { 
            "label" : props.language_top.split("-")[0],
            "value" : ((parseFloat(props.language_pct_top))*100).toFixed(1)
          } , 
          { 
            "label" : props.language_second.split("-")[0], 
            "value" : ((parseFloat(props.language_pct_second))*100).toFixed(1)
          } , 
          { 
            "label" : props.language_third.split("-")[0], 
            "value" : ((parseFloat(props.language_pct_third))*100).toFixed(1)
          } , 
          { 
            "label" : props.language_fourth.split("-")[0], 
            "value" : ((parseFloat(props.language_pct_fourth))*100).toFixed(1)
          } 
          // , 
          // { 
          //   "label" : props.language_fifth.split("-")[0],
          //   "value" : (100*props.language_pct_fifth).toFixed(1)
          // } 
        ]
      }
    ]

  }

} 

legend.onAdd = function (map) {

  var divAll = L.DomUtil.create('div', 'info legend'),
    gradesAll = [0, 10, 25, 50],
    labelsAll = [],
    from, to;

  for (var i = 0; i < gradesAll.length; i++) {
    from = gradesAll[i];
    to = gradesAll[i + 1];

    labelsAll.push(
      '<i style="background:' + getAllColor(from + 0.1, "NTA") + '"></i> ' +
      from + (to ? '% &ndash; ' + to + '%' : '% +') );
  }

  divAll.innerHTML = "<h5>All - Speak English Less Than 'Very Well'</h5>" + '<i style= "outline: thin black dashed; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getAllColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getAllColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsAll.join('<br>');
            
  return divAll;
};

legend.addTo(map1);


info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.updateAll();
  return this._div;
};

info.addTo(map1);

infoClick.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info click');
  this.updateAll(); 
  return this._div;
};

infoClick.addTo(map1);


//Spanish Layer

var spanish = L.geoJson(mapData, {style: spanishStyle, onEachFeature: onEachFeatureSpanish});

info.updateSpanish = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getSpanishColor(props.lgsplepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br />' + "Spanish - Speak English Less Than 'Very Well' <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgsplepp + '%</h5>') : '<h5>Hover over a Neighborhood</h5>');
};

function getSpanishColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 5 ? '#edf8fb':
  d <= 15 ? '#b3cde3':
  d <= 25 ? '#8c96c6':
  '#88419d';
}

function spanishStyle(feature) {
  return {
  fillColor: getSpanishColor(feature.properties.lgsplepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureSpanish(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightSpanish,
        click: zoomToFeatureAll
    });
}

function highlightFeatureSpanish(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateSpanish(layer.feature.properties);
} 

function resetHighlightSpanish(e) {
    spanish.resetStyle(e.target);
}

function zoomToFeatureSpanish(e) {
    map1.fitBounds(e.target.getBounds());
    info.updateSpanish(layer.feature.properties);
}

//French Creole Layer

var frenchCreole = L.geoJson(mapData, {style: frenchCrStyle, onEachFeature: onEachFeatureFrenchCr});

info.updateFrenchCr = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getFrenchCrColor(props.lgfrcrlepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br />' + "French Creole - Speak English Less Than 'Very Well' <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgfrcrlepp + '%</h5>') : '<h5>Hover over a Neighborhood</h5>');
};

function getFrenchCrColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 0.5 ? '#feebe2':
  d <= 2.5 ? '#fbb4b9':
  d <= 4.5 ? '#f768a1':
  '#ae017e';
}

function frenchCrStyle(feature) {
  return {
  fillColor: getFrenchCrColor(feature.properties.lgfrcrlepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureFrenchCr(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightFrenchCr,
        click: zoomToFeatureAll
    });
}

function highlightFeatureFrenchCr(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateFrenchCr(layer.feature.properties);
} 

function resetHighlightFrenchCr(e) {
    frenchCreole.resetStyle(e.target);
}

function zoomToFeatureFrenchCr(e) {
    map1.fitBounds(e.target.getBounds());
    info.updateFrenchCr(layer.feature.properties);
}

//Italian Layer

var italian = L.geoJson(mapData, {style: italianStyle, onEachFeature: onEachFeatureItalian});

info.updateItalian = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getItalianColor(props.lgitlepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br />' + "Italian - Speak English Less Than 'Very Well' <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgitlepp + '%</h5>') : '<h5>Hover over a Neighborhood</h5>');
};

function getItalianColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 0.5 ? '#fee5d9':
  d <= 1 ? '#fcae91':
  d <= 2 ? '#fb6a4a':
  '#cb181d';
}

function italianStyle(feature) {
  return {
  fillColor: getItalianColor(feature.properties.lgitlepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureItalian(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightItalian,
        click: zoomToFeatureAll
    });
}

function highlightFeatureItalian(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateItalian(layer.feature.properties);
} 

function resetHighlightItalian(e) {
    italian.resetStyle(e.target);
}

function zoomToFeatureItalian(e) {
    map1.fitBounds(e.target.getBounds());
    info.updateItalian(layer.feature.properties);
}

//Russian Layer

var russian = L.geoJson(mapData, {style: russianStyle, onEachFeature: onEachFeatureRussian});

info.updateRussian = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getRussianColor(props.lgruslepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br />' + "Russian - Speak English Less Than 'Very Well' <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgruslepp + '%</h5>')
      : '<h5>Hover over a Neighborhood</h5>');
};

function getRussianColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 2 ? '#fee5d9':
  d <= 10 ? '#fcae91':
  d <= 20 ? '#fb6a4a':
  '#cb181d';
}

function russianStyle(feature) {
  return {
  fillColor: getRussianColor(feature.properties.lgruslepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureRussian(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightRussian,
        click: zoomToFeatureAll
    });
}

function highlightFeatureRussian(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateRussian(layer.feature.properties);
} 

function resetHighlightRussian(e) {
    russian.resetStyle(e.target);
}

function zoomToFeatureRussian(e) {
    map1.fitBounds(e.target.getBounds());
    info.updateRussian(layer.feature.properties);
}

//Chinese Layer

var chinese = L.geoJson(mapData, {style: chineseStyle, onEachFeature: onEachFeatureChinese});

info.updateChinese = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getChineseColor(props.lgchilepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br />' + "Chinese - Speak English Less Than 'Very Well' <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgchilepp + '%</h5>')
      : '<h5>Hover over a Neighborhood</h5>');
};

function getChineseColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 3 ? '#f1eef6':
  d <= 10 ? '#bdc9e1':
  d <= 20 ? '#74a9cf':
  '#0570b0';
}

function chineseStyle(feature) {
  return {
  fillColor: getChineseColor(feature.properties.lgchilepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureChinese(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightChinese,
        click: zoomToFeatureAll
    });
}

function highlightFeatureChinese(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateChinese(layer.feature.properties);
} 

function resetHighlightChinese(e) {
    chinese.resetStyle(e.target);
}

function zoomToFeatureChinese(e) {
    map1.fitBounds(e.target.getBounds());
    info.updateChinese(layer.feature.properties);
}

//Korean Layer

var korean = L.geoJson(mapData, {style: koreanStyle, onEachFeature: onEachFeatureKorean});

info.updateKorean = function (props) {
  this._div.innerHTML =   (props ? 
    // '<i style="background:' + getKoreanColor(props.lgkorlepp, props.bndrytype) + '"></i> ' + 
    '<b>' + props.ntaname + '</b><br />' + "Korean - Speak English Less Than 'Very Well' <h5>" + (props.bndrytype != 'NTA' ? 'N/A' : props.lgkorlepp + '%</h5>')
      : '<h5>Hover over a Neighborhood</h5>');
};

function getKoreanColor(d,k) {
  return k === 'Airport/Non-Park'? '#969696':
  k === 'Parks'? '#bae4b3':
  d <= 0.5 ? '#f1eef6':
  d <= 2 ? '#d7b5d8':
  d <= 5 ? '#df65b0':
  '#ce1256';
}

function koreanStyle(feature) {
  return {
  fillColor: getKoreanColor(feature.properties.lgkorlepp, feature.properties.bndrytype),
  weight: .5,
  opacity: 1,
  fillOpacity: 0.5,
  color: 'grey'
  };
}

function onEachFeatureKorean(feature, layer) {
    layer.on({
        mouseover: highlightFeatureAll,
        mouseout: resetHighlightKorean,
        click: zoomToFeatureAll
    });
}

function highlightFeatureKorean(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  info.updateKorean(layer.feature.properties);
} 

function resetHighlightKorean(e) {
    korean.resetStyle(e.target);
}

function zoomToFeatureKorean(e) {
    map1.fitBounds(e.target.getBounds());
    info.updateKorean(layer.feature.properties);
}


var baselayMaps = {
  "All - Speak English Less Than 'Very Well'": all,
  "Spanish - Speak English Less Than 'Very Well'": spanish,
  "French Creole - Speak English Less Than 'Very Well'": frenchCreole,
  "Italian - Speak English Less Than 'Very Well'": italian,
  "Russian - Speak English Less Than 'Very Well'": russian,
  "Chinese - Speak English Less Than 'Very Well'": chinese,
  "Korean - Speak English Less Than 'Very Well'": korean
};

L.control.layers(baselayMaps, null, {collapsed:false}).addTo(map1); 


//Legend Change
map1.on("baselayerchange", function(eventLayer) {
  legend.getContainer().innerHTML = eventLayer.name;
  if (eventLayer.name === "All - Speak English Less Than 'Very Well'") {

    var gradesAll = [0, 10, 25, 50],
        labelsAll = [],
        from, to;

    for (var i = 0; i < gradesAll.length; i++) {
      from = gradesAll[i];
      to = gradesAll[i + 1];

      labelsAll.push(
        '<i style="background:' + getAllColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getAllColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getAllColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsAll.join('<br>');
    } 

  
  else if (eventLayer.name === "Spanish - Speak English Less Than 'Very Well'") {

    var gradesSpanish = [0, 5, 15, 25],
        labelsSpanish = [],
        from, to;

    for (var i = 0; i < gradesSpanish.length; i++) {
      from = gradesSpanish[i];
      to = gradesSpanish[i + 1];

      labelsSpanish.push(
        '<i style="background:' + getSpanishColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getSpanishColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getSpanishColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsSpanish.join('<br>');
    }

  else if (eventLayer.name === "French Creole - Speak English Less Than 'Very Well'") {

    var gradesFrenchCr = [0, 0.5, 2.5, 4.5],
        labelsFrenchCr = [],
        from, to;

    for (var i = 0; i < gradesFrenchCr.length; i++) {
      from = gradesFrenchCr[i];
      to = gradesFrenchCr[i + 1];

      labelsFrenchCr.push(
        '<i style="background:' + getFrenchCrColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getFrenchCrColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getFrenchCrColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsFrenchCr.join('<br>');
    } 

  else if (eventLayer.name === "Italian - Speak English Less Than 'Very Well'") {

    var gradesItalian = [0, 0.5, 1, 2],
        labelsItalian = [],
        from, to;

    for (var i = 0; i < gradesItalian.length; i++) {
      from = gradesItalian[i];
      to = gradesItalian[i + 1];

      labelsItalian.push(
        '<i style="background:' + getItalianColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getItalianColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getItalianColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsItalian.join('<br>');
    } 

  else if (eventLayer.name === "Russian - Speak English Less Than 'Very Well'") {

    var gradesRussian = [0, 2, 10, 20],
        labelsRussian = [],
        from, to;

    for (var i = 0; i < gradesRussian.length; i++) {
      from = gradesRussian[i];
      to = gradesRussian[i + 1];

      labelsRussian.push(
        '<i style="background:' + getRussianColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getRussianColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getRussianColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsRussian.join('<br>');
    } 

  else if (eventLayer.name === "Chinese - Speak English Less Than 'Very Well'") {

    var gradesChinese = [0, 3, 10, 20],
        labelsChinese = [],
        from, to;

    for (var i = 0; i < gradesChinese.length; i++) {
      from = gradesChinese[i];
      to = gradesChinese[i + 1];

      labelsChinese.push(
        '<i style="background:' + getChineseColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getChineseColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getChineseColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsChinese.join('<br>');
    } 

  else if (eventLayer.name === "Korean - Speak English Less Than 'Very Well'") {

    var gradesKorean = [0, 0.5, 2, 5],
        labelsKorean = [],
        from, to;

    for (var i = 0; i < gradesKorean.length; i++) {
      from = gradesKorean[i];
      to = gradesKorean[i + 1];

      labelsKorean.push(
        '<i style="background:' + getKoreanColor(from + 0.1, "NTA") + '"></i> ' +
        from + (to ? '% &ndash; ' + to + '%' : '% +') );
    }

    legend.getContainer().innerHTML = "<h5>" + eventLayer.name + "</h5>" + '<i style= "outline: black dashed thin; border:thin black dashed"></i>' + 'Community District' + '<br>' + '<i style="background:' + getKoreanColor(0, "Airport/Non-Park") + '"></i> ' + 'Airports/Navy Yards' + '<br>' + '<i style="background:' + getKoreanColor(0, "Parks") + '"></i> ' + 'Parks/Open Space/Cemetery' + '<br><br>' + labelsKorean.join('<br>');
    }  

});

// var layerUrl = 'http://documentation.cartodb.com/api/v2/viz/236085de-ea08-11e2-958c-5404a6a683d5/viz.json';

// cartodb.createLayer(map, layerUrl)
//   .addTo(map)
//   .on('done', function(layer) {

//   }).on('error', function() {
//     //log the error
//   });

// nv.addGraph(function() {
//   var ntaChart = nv.models.discreteBarChart()
//       .x(function(d) { return d.label })    //Specify the data accessors.
//       .y(function(d) { return d.value })
//       .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
//       .tooltips(false)        //Don't show tooltips
//       .showValues(true)       //...instead, show the bar value right on top of each bar.
//       // .transitionDuration(350)
//       ;

//   d3.select('#ntaChart svg')
//       .datum(exampleData())
//       .call(ntaChart);

//   nv.utils.windowResize(ntaChart.update);

//   return ntaChart;
// });

// //Each bar represents a single discrete quantity.
// function exampleData() {
//  return  [ 
//     {
//       key: "Cumulative Return",
//       values: [
//         { 
//           "label" : "Top" ,
//           "value" : 29.765957771107
//         } , 
//         { 
//           "label" : "Second" , 
//           "value" : 22
//         } , 
//         { 
//           "label" : "Third" , 
//           "value" : 32.807804682612
//         } , 
//         { 
//           "label" : "Fourth" , 
//           "value" : 12.945946739256
//         } , 
//         { 
//           "label" : "Fifth" ,
//           "value" : 19.434030906893
//         } 
//       ]
//     }
//   ]

// }