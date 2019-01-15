class Users {

    constructor() {
        this.users = [];
    }

    addUser (id, name, room) {
        var user = {id, name, room};
        
        this.users.push( user);
        return user;
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user)=> user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) =>user.id === id)[0];
    }

    getUserByName(name) {
        return this.users.filter((user) =>user.name === name)[0];
    }

    getUserList(room){
        var users = this.users.filter(user =>user.room.toLowerCase() === room.toLowerCase());
        var namesArray = users.map((user) => user.name);
        return namesArray;
        
    }

    getExistingRooms(){
        var res = [];
        this.users.map(function (item) {
            return item.room;
          }).forEach(function (item) {
            if (res.indexOf(item) === -1) {
              res.push(item);
            }
          });
        return res;
    }
}

module.exports = {Users};
