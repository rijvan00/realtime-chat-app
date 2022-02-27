const socket = io.connect();

const form = document.getElementById('sendContainer');
const messageInput = document.getElementById('messageinput');
const messageContainer = document.querySelector(".container");
const audio = new Audio('ting.mp3');
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
}
}

form.addEventListener('submit' , (e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

const name =  prompt("Enter your name to join");
socket.emit('new-user-joined',name);

socket.on('user-joined', name =>{
    append(`${name}: Joined The Chat`, 'right')
})
socket.on('receive', data =>{
    append(`${data.name} : ${data.message}`, 'left')
})

socket.on('left', name =>{
    append(`${name}: left the chat`, 'right')
})




