  // initiate the request and keep the connection open
  var socket = io();

  socket.on('existingRooms', function(existingRooms) {
    console.log('Existing rooms', existingRooms);
    if(existingRooms.length === 0){
      return;
    }
  
    var ol = jQuery('<select></select>');
    existingRooms.forEach(function (room) {
      ol.append(jQuery('<option></option>').text(room));
    });
    ol.attr('name', 'existingRoom');

    jQuery('#rooms').html(ol);
  });