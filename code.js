//Visualizacion de satelite
Map.setOptions({mapTypeId: 'SATELlITE'});


//Nevados
var nevado = Huascaran.merge(Huandoy).merge(Palcaraju);
print(nevado);
//Diccionario de nevados 
var nevado_dic = {
  'Nevado Huascaran': [1],
  'Nevado Huandoy':[2],
  'Nevado Palcaraju': [3]
};
//print(nevado_dic);

// Inicio de la Aplicacion Earth Engine 
var select_nev = ui.Select({
  items: Object.keys(nevado_dic),
  placeholder: 'Seleccionar Nevado', 
  onChange: function(i){
    print(i);
    Map.addLayer(nevado.filter(ee.Filter.inList('name', [i])));
    Map.centerObject(nevado.filter(ee.Filter.inList('name', [i])),12);
  }
});



// Crear nuestro dicciconario de objetos

//var img_col = ee.ImageCollection("COPERNICUS/S2_SR").first();
//print(img_col);
var bandas = {
"B1": [],
"B2": [],
"B3": [],
"B4": [],
"B5": [],
"B6": [],
"B7": [],
"B8": [],
"B8A": [],
"B9": [],
"B11": [],
"B12": [],
"QA10": [],
"QA20": [],
"QA60": [],
};

// Dicccionario de fecha, delizadores y etiquetas 
var dic_obje = {
  Desli_fecha: ui.DateSlider({start:'2015-01-01', end:ee.Date(Date.now()), period: 10, onChange: function(){}}), 
  //Seleccionar bandas 
  select_banda: {
    B1:ui.Select({items:Object.keys(bandas), placeholder: 'Primera banda', onChange: function(){}}),
    B2:ui.Select({items:Object.keys(bandas), placeholder: 'Segunda banda', onChange: function(){}}),
    B3:ui.Select({items:Object.keys(bandas), placeholder: 'Tercera banda', onChange: function(){}})
  },
  etiqueta1: ui.Label('Min', {}),
  desliz1: ui.Slider({min:500, max: 5000, step: 100, onChange: function(){}}),
  etiqueta2: ui.Label('Max', {}),
  desliz2: ui.Slider({min:500, max: 5000, step: 100, onChange: function(){}}),
  etiqueta3: ui.Label('Gamma', {}),
  desliz3: ui.Slider({min:0, max: 2, step: 0.1, onChange: function(){}}),
};
//Titulo APP
var titulo = ui.Label({value: 'Monitorio de glaciares tropicales', style: {'fontSize': '24px'}})

//Creacion de boton con colecciones de imagenes sentinel 
var boton = ui.Button({label: 'Aplicar', onClick: function(){
  var coleccion = ee.ImageCollection("COPERNICUS/S2_SR").filterBounds(Map.getBounds(select_nev.getValue()))
                  .filterDate(ee.Date(dic_obje.Desli_fecha.getValue()[0]).format('YYYY-MM-dd'), ee.Date(dic_obje.Desli_fecha.getValue()[1]).format('YYYY-MM-dd'))
                  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 10).median().clip(Map.getBounds(select_nev.getValue()));
  var capa = ui.Map.Layer({eeObject: coleccion, 
  visParams: {bands: [dic_obje.select_banda.B1.getValue(), dic_obje.select_banda.B2.getValue(),dic_obje.select_banda.B3.getValue()], 
    min: dic_obje.desliz1.getValue(), max: dic_obje.desliz2.getValue(), gamma: dic_obje.desliz3.getValue()
  }, name: 'Imagen Sentinel', shown: true})  
  
  Map.layers().set(0, capa);
  // print(dicobjectos.Sliderfecha.getValue())
 //print(dicobjectos.select.B1.getValue(), dicobjectos.select.B2.getValue(), dicobjectos.select.B3.getValue())
  //print(dicobjectos.slider1.getValue(),dicobjectos.slider2.getValue(), dicobjectos.slider3.getValue())
}});

//panel opcional para bandas horizontales 
var panelh = ui.Panel({widgets: [ dic_obje.select_banda.B1, dic_obje.select_banda.B2,dic_obje.select_banda.B3], 
layout:ui.Panel.Layout.flow('horizontal'), style: {backgroundColor: '00001111'}})
//Panel principal 
var panel = ui.Panel({widgets: [titulo,select_nev, dic_obje.Desli_fecha,panelh, dic_obje.etiqueta1, dic_obje.desliz1
, dic_obje.etiqueta2, dic_obje.desliz2, dic_obje.etiqueta3, dic_obje.desliz3, boton], 
layout: ui.Panel.Layout.flow('vertical'), 
style: {width: '400px'}}); // backgroundColor: '11115555'

//Map.add(panel);

ui.root.add(panel)

Link: https://code.earthengine.google.com/4d48cfa7e6791ceee2b4c9e30bc74d37
