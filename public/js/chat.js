
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
const sidebar_template = document.getElementById('sidebar-template').innerHTML;

//Optional
//location is global variable where we can use search to get query string
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});


const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild
     // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
     // Visible height
    const visibleHeight = $message.offsetHeight
     // Height of messages container
    const containerHeight = $message.scrollHeight
     // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight
if (containerHeight - newMessageHeight <= scrollOffset) { $message.scrollTop = $message.scrollHeight
} }

//listening to the sideBarInfo 
socket.on('sideBarInfo',({users,room})=>{
    const html = Mustache.render(sidebar_template,{
        users,
        room
    });
    document.getElementById('sidebar').innerHTML = html;
})
socket.on('message',(msg)=>{
    // console.log(msg)
    var html = Mustache.render(message_template,{
        username: msg.username,
        text: msg.text,
        createdAt : moment(msg.timeStamp).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend',html)
    // console.log(msg.text);
    // console.log(msg.timeStamp);
    autoscroll();

});

socket.on('locationMessage',(location_message)=>{
    // console.log(location_message)
    var html = Mustache.render(location_template,{
        username:location_message.username,
        url:location_message.url,
        createdAt:moment(location_message.timeStamp).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend',html);
    // console.log(location);
    autoscroll();
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
