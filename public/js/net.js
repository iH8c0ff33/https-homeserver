var socket = io.connect('http://danielemonteleone.zapto.org');
function updateNet() {
  socket.emit('networkRequest');
}
socket.on('connect', function() {
  updateNet();
});
socket.on('networkHosts', function (hosts) {
  $('#tableBody').empty();
  for(var i = 0, tot = hosts.length; i < tot; i++) {
    $('#tableBody').append('<tr><th>'+(i + 1)+'</th><th>'+hosts[i].address+'</th><th>'+hosts[i].name+'</th><th>'+hosts[i].state+'</th><th>'+hosts[i].macAddress+'</th></tr>');
  }
});
