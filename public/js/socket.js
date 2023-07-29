class socket{
    constructor(){
        this.Socket = io();
        this.roomname=null
        this.Socket.on("error-joining-room", (msg) => {
            console.log("error in joining a room");
            console.log(msg);
        })
        this.Socket.on("error-leaving-room", (msg) => {
            console.log("error in joining a room");
            console.log(msg);
        })
        this.Socket.on("room-joined", (msg) => {
            console.log(msg);
            this.roomname = msg.roomname;
        })
        // this.Socket.on("room-message", (msg) => {
        //     console.log(msg);
        // })
    }
    joinRoom(roomid){
        this.Socket.emit('join-room-public',roomid)
    }
    leaveRoom(){
        if(!this.roomname){
            console.error('no room joined')
            return
        }
        this.Socket.emit('leave-room',this.roomname)
    }
    send(msg){
        if(!this.roomname){
            console.error('no room joined')
            return
        }
        this.Socket.emit('message-to-room',this.roomname,msg)
    }
    startListner(callback){
        // if(!this.roomname){
        //     console.error('no room joined')
        //     return
        // }
        this.Socket.on('room-message', callback)
    }
    
}





// (msg) => {
//     switch (msg.type) {
//         case "offer":
//             console.log("offer recieved");
//             // recieve(msg);
//             break;
//         case "answer":
//             console.log("answer recieved");
//             // recieveanswer(msg);
//             break;
//         case "candidate":
//             console.log("candidate recieved");
//             // handleCandidate(msg);
//             break;
//         case "startstream":
//             console.log("startstream recieved");
//             // startmystream();
//             break;
//         case "reoffer":
//             console.log("reoffer recieved");
//             // renegotiateanswer(msg);
//             break;
//         default:
//             console.log(msg)
//     }
// }