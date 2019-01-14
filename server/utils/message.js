var moment = require('moment');
const fromatter = 'MMM Do YYYY, h:mm a'
var generateMessage =(from, text)=>{
    var date = moment(new Date().getTime());
    var createdAt = date.format(fromatter);
    return {
        from, 
        text, 
        createdAt
    }
}

var generateLocationMessage = (from, lat, long) =>{
    var date = moment(new Date().getTime());
    var createdAt = date.format(fromatter);
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt
    }

}

module.exports = {generateMessage, generateLocationMessage};