// Basit OpenLayers haritası: OSM + işaretçi + popup
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([32.735, 39.870]), // Hacettepe Beytepe civarı (lon, lat)
    zoom: 14
  }),
  controls: ol.control.defaults().extend([
    new ol.control.ScaleLine(),     // ölçek çizgisi
    new ol.control.ZoomSlider()     // zoom slider
  ])
});

// İşaretçi
const marker = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([32.735, 39.870])),
  name: 'Hacettepe Beytepe',
  desc: 'GMT 458 – Web GIS örnek konum'
});

marker.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({ color: '#60a5fa' }),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
    })
  })
);

const vectorSource = new ol.source.Vector({ features: [marker] });
const vectorLayer = new ol.layer.Vector({ source: vectorSource });
map.addLayer(vectorLayer);

// Popup overlay
const popupEl = document.getElementById('popup');
const overlay = new ol.Overlay({
  element: popupEl,
  offset: [0, -12],
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(overlay);

// Tıklayınca popup göster
map.on('singleclick', (evt) => {
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
  if (feature) {
    const coord = feature.getGeometry().getCoordinates();
    document.getElementById('popup-title').textContent = feature.get('name') || 'Konum';
    document.getElementById('popup-desc').textContent  = feature.get('desc') || '';
    overlay.setPosition(coord);
    popupEl.style.display = 'block';
  } else {
    popupEl.style.display = 'none';
  }
});
