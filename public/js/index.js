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

      // socket.emit('createMessage', {
      //         from : 'client',
      //         text : 'response from client'
      //   });
  });

  socket.on('disconnect',function () {
      console.log('Disconnected from server!');
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
      from : 'User',
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