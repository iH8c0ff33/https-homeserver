var socket = io.connect('https://danielemonteleone.zapto.org');
var services = [];
socket.on('connect', function () {
  socket.emit('servicesRequest');
});
socket.on('servicesList', function(data) {
  services = data;
  $('#container').empty();
  $('#container').append('<div class="panel panel-primary" id="panel"></div>');
  $('#panel').append('<div class="panel-heading" id="panelHeading">Services status</div>');
  $('#panelHeading').append('<span class="label label-info pull-right" style="position: relative; top: 2px;">services</span>');
  $('#panel').append('<div class="panel-body" id="panelBody"></div>');
  $('#panelBody').append('<div class="table-responsive"><table class="table table-striped table-hover"><thead><th>Name</th><th>Load</th><th>State</th><th>Description</th></thead><tbody id="tableBody"></tbody></table></div>');
  for (var current = 0, length = services.length; current < length; current++) {
    var loadColor = 'label-info';
    var stateColor = 'label-info';
    if (services[current].load == 'loaded') { loadColor = 'label-primary'; }
    if (services[current].state == 'running') {
      stateColor = 'label-success';
    } else if (services[current].state == 'plugged') {
      stateColor = 'label-info';
    } else if (services[current].state == 'failed') {
      stateColor = 'label-danger';
    } else if (services[current].state == 'exited') {
      stateColor = 'label-warning';
    } else if (services[current].state == 'mounted') {
      stateColor = 'label-success';
    } else if (services[current].state == 'active') {
      stateColor = 'label-success';
    } else {
      stateColor = 'label-primary';
    }
    $('#tableBody').append('<tr><th>'+services[current].name+'</th><th><span class="label '+loadColor+'">'+services[current].load+'</span></th><th><span class="label '+stateColor+'">'+services[current].state+'</span></th><th>'+services[current].desc+'</th></tr>');
  }
});
