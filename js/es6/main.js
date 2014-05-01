(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    initMap(38, -80, 4);
    $('#add').click(add);
  }
  var map;
  var charts = {};
  var chartsData = {};
  var place;
  function add() {
    place = $('#place').val().trim();
    $('#place').val('').focus();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: place}, (function(results, status) {
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      var icon = './media/flag.png';
      addMarker(lat, lng, name, icon);
      var latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);
    }));
    var url = 'http://api.wunderground.com/api/c2baded694e3d4d5/forecast10day/q/' + place + '.json?callback=?';
    $.getJSON(url, weather);
  }
  function weather(data) {
    $traceurRuntime.setProperty(chartsData, place, {});
    chartsData[$traceurRuntime.toProperty(place)].dataProvider = [];
    $('#graph').append(("<div class=graph data-zip=" + place + "></div>"));
    for (var i = 0; i < 10; i++) {
      var high = data.forecast.simpleforecast.forecastday[$traceurRuntime.toProperty(i)].high.fahrenheit * 1;
      var low = data.forecast.simpleforecast.forecastday[$traceurRuntime.toProperty(i)].low.fahrenheit * 1;
      var day = data.forecast.simpleforecast.forecastday[$traceurRuntime.toProperty(i)].date.weekday;
      chartsData[$traceurRuntime.toProperty(place)].dataProvider.push({
        'high': high,
        'low': low,
        'day': day
      });
    }
    createGraph();
    charts[$traceurRuntime.toProperty(place)].validateData();
  }
  function createGraph() {
    var graph = $((".graph[data-zip=" + place + "]"))[0];
    $traceurRuntime.setProperty(charts, place, AmCharts.makeChart(graph, {
      'type': 'serial',
      'theme': 'none',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'legend': {'useGraphSettings': true},
      'titles': [{
        'text': place,
        'size': 15
      }],
      'dataProvider': chartsData[$traceurRuntime.toProperty(place)].dataProvider,
      'valueAxes': [{
        'id': 'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
      }],
      'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Low',
        'valueField': 'low',
        'fillAlphas': 0
      }, {
        'valueAxis': 'v1',
        'lineColor': '#FCD202',
        'bullet': 'square',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'High',
        'valueField': 'high',
        'fillAlphas': 0
      }],
      'chartCursor': {'cursorPosition': 'mouse'},
      'categoryField': 'day',
      'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
      }
    }));
  }
  function addMarker(lat, lng, name, icon) {
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name,
      icon: icon
    });
  }
  function initMap(lat, lng, zoom) {
    var styles = [{
      'elementType': 'geometry',
      'stylers': [{'hue': '#ff4400'}, {'saturation': -68}, {'lightness': -4}, {'gamma': 0.72}]
    }, {
      'featureType': 'road',
      'elementType': 'labels.icon'
    }, {
      'featureType': 'landscape.man_made',
      'elementType': 'geometry',
      'stylers': [{'hue': '#0077ff'}, {'gamma': 3.1}]
    }, {
      'featureType': 'water',
      'stylers': [{'hue': '#00ccff'}, {'gamma': 0.44}, {'saturation': -33}]
    }, {
      'featureType': 'poi.park',
      'stylers': [{'hue': '#44ff00'}, {'saturation': -23}]
    }, {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [{'hue': '#007fff'}, {'gamma': 0.77}, {'saturation': 65}, {'lightness': 99}]
    }, {
      'featureType': 'water',
      'elementType': 'labels.text.stroke',
      'stylers': [{'gamma': 0.11}, {'weight': 5.6}, {'saturation': 99}, {'hue': '#0091ff'}, {'lightness': -86}]
    }, {
      'featureType': 'transit.line',
      'elementType': 'geometry',
      'stylers': [{'lightness': -48}, {'hue': '#ff5e00'}, {'gamma': 1.2}, {'saturation': -23}]
    }, {
      'featureType': 'transit',
      'elementType': 'labels.text.stroke',
      'stylers': [{'saturation': -64}, {'hue': '#ff9100'}, {'lightness': 16}, {'gamma': 0.47}, {'weight': 2.7}]
    }];
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
})();

//# sourceMappingURL=main.map
