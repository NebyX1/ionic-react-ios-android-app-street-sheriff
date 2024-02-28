import L from 'leaflet';

const initializeMap = (mapRef, setSelectedPosition) => {
  const map = L.map(mapRef.current, {
    zoomControl: false,
  }).setView([-34.37, -55.23], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "",
  }).addTo(map);

  map.attributionControl.setPrefix("");

  var customMarkerIcon = L.divIcon({
    className: "custom-icon",
    html: '<i class="fas fa-map-marker-alt fa-3x" style="color: orange; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const marker = L.marker([-34.37, -55.23], { icon: customMarkerIcon }, {
    draggable: true,
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 100);

  marker.on("dragend", function (e) {
    const position = marker.getLatLng();
    setSelectedPosition(position);
  });

  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
    setSelectedPosition(e.latlng);
  });
};

export default initializeMap;