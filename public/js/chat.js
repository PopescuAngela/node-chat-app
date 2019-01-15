  // initiate the request and keep the connection open
  var socket = io();

  function scrollToBottom()  {
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight){
      //scroll to bottom
      console.log('Should scroll');
      messages.scrollTop(scrollHeight);
    }
  }

  socket.on('connect',function () {
      console.log('Connected to server!');

      var params = jQuery.deparam(window.location.search);

      socket.emit('join', params, function(error) {
          if(error) {
            alert(error);
            window.location.href = "/"; 
          } else {
             console.log('No error') ;
          }
      });
  });

  socket.on('disconnect',function () {
      console.log('Disconnected from server!');
  });

  socket.on('updateUserList', function(users) {
    console.log('Users list', users);

    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
      ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
  });

  
  socket.on('newMessage', function (message) {
      console.log('New message received!', message); 

      var template = jQuery('#message-template').html();
      var html = Mustache.render(template, {
        from:message.from,
        text:message.text,
        createdAt:message.createdAt
      });

      jQuery('#messages').append(html);
      scrollToBottom();
  });


  jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
      text: jQuery('[name=message]').val()
    }, function () {
      jQuery('[name=message]').val('');
    });

  });


  var locationButton = jQuery('#send-location');
  locationButton.on('click', function() {
    if(!navigator.geolocation) {
      return alert('No geolocation is available');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function (){
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.');
    });
  });

  // send new location message throw socket
  socket.on('newLocationMessage', function (message) {
    console.log('New location message received!', message); 

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from:message.from,
      url:message.url,
      createdAt:message.createdAt
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('existingRooms', function(existingRooms) {
  console.log('Existing rooms', existingRooms);

  var ol = jQuery('<ol></ol>');
  existingRooms.forEach(function (room) {
    ol.append(jQuery('<li></li>').text(room));
  });

  jQuery('#rooms').html(ol);
});