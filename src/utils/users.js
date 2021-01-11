var users = [];
// addUser, removeUser,


const addUser = ({id,username,room})=>{

      //clearing the data
      username = username.trim().toLowerCase();
      room = room.trim().toLowerCase();

      //validating the data
      if(!username||!room){
          return {
              error:'Username and Room requires'
          }
        }
        
       const checkingDuplicate = users.find((user)=>{
            return user.username ==username && user.room == room
        })

        if(checkingDuplicate){
            return {
                error:'username already in use!'
            }
        }

        const user = {id,username,room};
        users.push(user);
        return {user};
    }


    const removeUser = (id)=>{
             const userIndex = users.findIndex((user)=>{
                 return user.id === id
             })

             if(userIndex!==-1){
                 return users.splice(userIndex,1)[0]
             }

    }


    const getUser = (id)=>{
        const user = users.find((user)=>{
            return user.id === id
        });
        if(!user){
            return {
                error:'user not found'
            }
        }
        return user
    }

    const getUsersInRoom = (room)=>{
        const usersInRoom = users.filter((user)=>{
            return user.room == room;
        });

        if(usersInRoom.length==0){
            return {
                error:"No memebers in this room"
            }
        }
        return usersInRoom
    }

module.exports = {addUser,removeUser,getUser,getUsersInRoom}

    

        

