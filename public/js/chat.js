const socket = io()

// socket.on('countUpdated',(count)=>{
//     console.log("count updated to: ",count)
// });

// document.getElementById('increment').addEventListener('click',()=>{
//     socket.emit('increment');
// })

socket.on('message',(msg)=>{
    console.log(msg);
});
document.getElementById('send-btn').addEventListener('click',()=>{
    var message = document.getElementById('input-message').value;
    socket.emit('newMessage',message,(msg)=>{
        console.log("Messaged ",msg);
    });
});

document.getElementById('location-btn').addEventListener('click',()=>{
    if(!navigator.geolocation){
        console.log("your browser doesnt support gealocation services");
    }else{
        //doesnt support async/await or promises so we are using a function inside parameters
        navigator.geolocation.getCurrentPosition((postion)=>{
            // console.log(postion.coords.latitude,postion.coords.longitude);
            var locationCoordinates = {"latitude":postion.coords.latitude,
                                       "longitude":postion.coords.longitude}
            socket.emit('sendLocation',locationCoordinates);
        })
    }
})