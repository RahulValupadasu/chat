
const socket = io();

// socket.on('countUpdated',(count)=>{
//     console.log("count updated to: ",count)
// });

// document.getElementById('increment').addEventListener('click',()=>{
//     socket.emit('increment');
// })

//Elements
const $messageForm = document.querySelector('#message_form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $message = document.getElementById('messages');
//Templates
const message_template = document.getElementById('message-template').innerHTML;
const location_template = document.getElementById('location-template').innerHTML;

//Optional
//location is global variable where we can use search to get query string
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});


socket.on('message',(msg)=>{
    console.log(msg)
    var message = msg.text;
    var html = Mustache.render(message_template,{
        username: msg.username,
        text: msg.text,
        createdAt : moment(msg.timeStamp).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend',html)
    console.log(msg.text);
    console.log(msg.timeStamp);

});

socket.on('locationMessage',(location_message)=>{
    var html = Mustache.render(location_template,{
        url:location_message.url,
        createdAt:moment(location_message.timeStamp).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend',html);
    console.log(location);
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;
    socket.emit('newMessage',message,(ms)=>{
        console.log(ms);
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
       });
})

// document.getElementById('send-btn').addEventListener('click',()=>{
//     var message = document.getElementById('input-message').value;
//     socket.emit('newMessage',message,(ms)=>{
//         console.log(ms);
//         message = '';
//        });
// });

document.querySelector('#location-btn').addEventListener('click',()=>{
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

//emitting username and room 
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/'
    }
})
