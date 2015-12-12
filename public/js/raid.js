var socket = io.connect('https://danielemonteleone.zapto.org');
var pools = [];
socket.on('connect', function () {
  socket.emit('poolRequest');
});
socket.on('zfsPools', function (data) {
  pools = data;
  $('#container').empty();
  for (var current = pools.length - 1; current > -1; current--) {
    $('#container').append('<div class="panel panel-primary" id="disk'+current+'Panel"></div>');
    $('#disk'+current+'Panel').append('<div class="panel-heading" id="disk'+current+'Heading">'+pools[current].name+'</div>');
    $('#disk'+current+'Heading').append('<span class="label label-info" style="position: relative; left: 5px; bottom: 2px;">'+pools[current].raidType+'</span>');
    var stateColor = 'label-warning';
    if (pools[current].poolState == 'ONLINE') {
      stateColor = 'label-success';
    } else if (pools[current].poolState == 'DEGRADED') {
      stateColor = 'label-danger';
    }
    $('#disk'+current+'Heading').append('<span class="label '+stateColor+'" style="position: relative; left: 10px; bottom: 2px;">'+pools[current].poolState+'</span>');
    $('#disk'+current+'Heading').append('<span class="label pull-right" style="position: relative; top: 2px;">'+pools[current].mountPath+'</span>');
    $('#disk'+current+'Heading').append('<span class="label label-info pull-right" style="position: relative; top: 2px; right: 5px;">'+pools[current].availSpace+'</span>');
    $('#disk'+current+'Panel').append('<div class="panel-body" id="disk'+current+'Body"></div>');
    if (pools[current].poolStatus) {
      $('#disk'+current+'Body').append('<div class="alert alert-danger"><h4>Status</h4><p>'+pools[current].poolStatus+'</p></div>');
    }
    if (pools[current].poolAction) {
      var seeLink = '';
      if (pools[current].poolActionSee) {
        seeLink = '<a href="'+pools[current].poolActionSee+'"> Click here for info</a>';
      }
      $('#disk'+current+'Body').append('<div class="alert alert-warning"><h4>Action</h4><p>'+pools[current].poolAction+''+seeLink+'</p></div>');
    }
    $('#disk'+current+'Body').append('<div class="alert alert-info"><h4>Scan status</h4><p>'+pools[current].poolScan+'</p></div>');
    $('#disk'+current+'Body').append('<div class="table-responsive"><table class="table table-striped table-hover"><thead><tr><th>Name</th><th>State</th><th>State reason</th><th>Power state</th><th>R</th><th>W</th><th>CS</th></tr></thead><tbody id="disk'+current+'TableBody"</table></div>');
    for (var currentDisk = 0, lastDisk = pools[current].poolDisks.length; currentDisk < lastDisk; currentDisk++) {
      var reason = 'disk is ok';
      var reasonColor = 'label-success';
      if (pools[current].poolDisks[currentDisk].reason) {
        reasonColor = 'label-warning';
        reason = pools[current].poolDisks[currentDisk].reason;
      }
      var diskStateColor = 'label-warning';
      if (pools[current].poolDisks[currentDisk].state == 'ONLINE') {
        diskStateColor = 'label-success';
      } else if (pools[current].poolDisks[currentDisk].state == 'UNAVAIL') {
        diskStateColor = 'label-danger';
      }
      var diskPowerColor = 'label-info';
      if (pools[current].poolDisks[currentDisk].diskState == 'active/idle') {
        diskPowerColor = 'label-success';
      }
      var diskPowerState = 'virtual';
      if (pools[current].poolDisks[currentDisk].diskState) {
        diskPowerState = pools[current].poolDisks[currentDisk].diskState;
      }
      $('#disk'+current+'TableBody').append('<tr><th>'+pools[current].poolDisks[currentDisk].name+'</th><th><span class="label '+diskStateColor+'">'+pools[current].poolDisks[currentDisk].state+'</span></th><th><span class="label '+reasonColor+'">'+reason+'</span></th><th><span class="label '+diskPowerColor+'">'+diskPowerState+'</span></th><th>'+pools[current].poolDsisks[currentDisk].readErrors+'</th><th>'+pools[current].poolDisks[currentDisk].writeErrors+'</th><th>'+pools[current].poolDisks[currentDisk].checksumErrors+'</th><tr>');
    }
    var errorColor = 'alert-warning';
    if (pools[current].poolErrors == 'No known data errors') {
      errorColor = 'alert-success';
    }
    $('#disk'+current+'Body').append('<div class="alert '+errorColor+'"><h4>Errors</h4><p>'+pools[current].poolErrors+'</p></div>');
  }
});
