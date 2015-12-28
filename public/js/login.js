$('#send-button').click(function () {
  alert($('#email').val());
  $.post('/auth/requestToken', { email: $('#email').val() }, function (data) {
    console.log(data);
  });
});
