
function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7127, lng: -74.0059},
    zoom: 11
  });

  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
}
