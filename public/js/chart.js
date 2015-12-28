var socket = io.connect('https://danielemonteleone.zapto.org');
Highcharts.setOptions({
  global : {
    useUTC : false
  }
});
var daw;
var data = [];
$.getJSON('/ajax/temp-data', function (series) {
  data = series;
  $('#container').highcharts('StockChart', {
    chart : {
      events : { load : function () { daw = this.series[0]; } }
    },
    rangeSelector: {
      buttons: [{
        count: 1,
        type: 'minute',
        text: '1m'
      }, {
        count: 5,
        type: 'minute',
        text: '5m'
      }, {
        count: 1,
        type: 'hour',
        text: '1h'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false,
      selected: 1
    },
    title : { text : 'Test chart' },
    exporting: { enabled: false },
    series : [{
      name: 'Random Data',
      data: data
    }]
  });
});
socket.on('new-data', function (data) {
  console.log(data);
  daw.addPoint(data, true, true);
});
