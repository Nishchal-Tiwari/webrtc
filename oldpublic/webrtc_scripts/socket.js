const form = document.getElementById("send-container");
const socket = io();
socket.on("errorJoinRoom", (msg) => {
  console.log("error in joining a room");
  console.log(msg);
});
socket.on("roomJoined", (msg) => {
  console.log(msg);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const roomid = form.elements["roomid"].value;
  const username = form.elements["username"].value;
  const roomiddisplay = document.getElementById("roomno");
  const usersnamedisplay = document.getElementById("usersname");
  socket.emit("joinRoom", roomid, username);
  roomiddisplay.innerText = roomid;
  usersnamedisplay.innerText = username;
});
socket.on("messagefromroom", (msg) => {
  console.log(msg);
});
socket.on("random", (msg) => {
  console.log(msg);
});
socket.on("random1", (msg) => {
  console.log(msg);
});

socket.on("rmsg", (msg) => {
  if (msg.type == "offer") {
    console.log("offer recieved");
    recieve(msg);
  }
  if (msg.type == "answer") {
    console.log("answer recieved");
    recieveanswer(msg);
  }
  if (msg.type == "candidate") {
    console.log("candidate recieved");
    handleCandidate(msg);
  }
  if (msg.type == "startstream") {
    console.log("startstream recieved");
    startmystream();
  }
  if(msg.type=='reoffer'){
      console.log('reoffer recieved')
      renegotiateanswer(msg)
  }
  
});
handleCandidate = async e => {
    if(!conn){
        console.error('no connection')
        return  
    }
    if(!e.candidate){
        await conn.addIceCandidate(null)
    }
    else{
        await conn.addIceCandidate(e)
    }

}
socket.emit("joinRoom", "room1", "user1");



