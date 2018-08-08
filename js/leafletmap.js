var map = L.map('mapid').setView([21.169,105.60], 9);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGh1b25naGFvIiwiYSI6ImNqYjIwY2JhaTI2ZmIzMm85Ym51MHU3ZzkifQ.yvOaEOnr7WUrGJSkdIbnjw'
}).addTo(map);

map.on ("mousemove",function(evt){
    $("#lng").text(evt.latlng.lng.toFixed(5));
    $("#lat").text(evt.latlng.lat.toFixed(5));
});

var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    
    
var options = {
        position: 'topright',
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#f357a1',
                    weight: 10
                }
            },
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#bada55'
                }
            },
            circle: false, // Turns off this drawing tool
            circlemarker: false,
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            }
        },
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true
        }
    };
    
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    
    map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType,
            layer = e.layer;
    
        if (type === 'marker') {
            layer.bindPopup('A popup!');
        }
        if (type === 'rectangle') {
            console.log(layer.getBounds());
            $("#geometry").val("");
            $("#min_lng").val(layer.getBounds().getSouthWest().lng.toFixed(6));
            $("#min_lat").val(layer.getBounds().getSouthWest().lat.toFixed(6));
            $("#max_lng").val(layer.getBounds().getNorthEast().lng.toFixed(6));
            $("#max_lat").val(layer.getBounds().getNorthEast().lat.toFixed(6));
        }
        if (type === 'polygon') {
            $("#geometry").val(toWKT(layer));
            $("#min_lng").val("");
            $("#min_lat").val("");
            $("#max_lng").val("");
            $("#max_lat").val("");
        }
        if (type === 'polyline') {
            $("#geometry").val(toWKT(layer));
            $("#min_lng").val("");
            $("#min_lat").val("");
            $("#max_lng").val("");
            $("#max_lat").val("");
        }
        editableLayers.addLayer(layer);
    });
    
    function toWKT(layer) {
        var lng, lat, coords = [];
        if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
            var latlngs;
            if (layer instanceof L.Polygon) {
                latlngs = layer.getLatLngs()[0];
            } else if (layer instanceof L.Polyline) {
                latlngs = layer.getLatLngs();
            }
            for (var i = 0; i < latlngs.length; i++) {
                latlngs[i]
                coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                if (i === 0) {
                    lng = latlngs[i].lng;
                    lat = latlngs[i].lat;
                }
            };
            if (layer instanceof L.Polygon) {
                return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
            } else if (layer instanceof L.Polyline) {
                return "LINESTRING(" + coords.join(",") + ")";
            }
        } else if (layer instanceof L.Marker) {
            return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
        }
    }