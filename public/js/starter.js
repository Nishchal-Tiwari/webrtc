let stream;
let messenger;
let con;
let screenShare
const camera=document.getElementById('camera')
const audioin=document.getElementById('audioin')
const audioout=document.getElementById('audioout')

async function start(){
stream=new localStream()
messenger=new socket()
con=new rtc(null,messenger)
messenger.joinRoom('test')
const fn=document.getElementById('fun')
fn.onclick=()=>fun()
async function fun(){
    // con.conn.getSenders().forEach(sender => {
    //     if(sender.kind=='video')
    //     con.conn.removeTrack(sender);

        
    // })
    // canvastream.getTracks().forEach(track => {
    //         con.conn.addTrack(track, canvastream);
    //     })

    con.conn.getSenders().forEach(sender => {
        // if(sender.kind=='video')
        con.conn.removeTrack(sender); 
    })
    await stream.changeCamera(null,uservid.id)
    
    stream.mediaStream.getTracks().forEach(track => {
        console.log(track)
        con.conn.addTrack(track, stream.mediaStream);
    })
}
await stream.startStream(uservid.id)

// console.log(stream.videoStream.getTracks())
// screenShare=await navigator.mediaDevices.getDisplayMedia({ video: true })
stream.mediaStream.getTracks().forEach(track => {
    con.conn.addTrack(track, stream.mediaStream);
})
// screenShare.getTracks().forEach(track => {
//     con.conn.addTrack(track, screenShare);
// })
// canvastream.getTracks().forEach(track => {
//     con.conn.addTrack(track, canvastream);
// })


stream.cameraDevices.forEach(device =>{
    const newoption=document.createElement('option')
    newoption.value=device.deviceId
    newoption.innerText=device.label
    camera.appendChild(newoption)
   
    
})
camera.onchange=async (e)=>{
    con.conn.getSenders().forEach(sender => {
        if(sender.kind=='video')
        con.conn.removeTrack(sender); 
    })
    await stream.changeCamera(e.target.value,uservid.id)
    
    stream.videoStream.getTracks().forEach(track => {
        con.conn.addTrack(track, stream.videoStream);
    })
    
}
stream.speakerDevices.forEach(device =>{
    const newoption=document.createElement('option')
    newoption.value=device.deviceId
    newoption.innerText=device.label
    
    audioout.appendChild(newoption)
    
})
audioout.onchange=(e)=>{
    stream.changeAudioOutputDevice(e.target.value,callervid.id)
   
}
stream.microphoneDevices.forEach(device =>{
    const newoption=document.createElement('option')
    newoption.value=device.deviceId
    newoption.innerText=device.label
    audioin.appendChild(newoption)
})
audioin.onchange=async (e)=>{
    con.conn.getSenders().forEach(sender => {
        if(sender.kind=='audio')
        con.conn.removeTrack(sender); 
    })
    await stream.changeMicrophone(e.target.value,uservid.id)
    
    stream.audioStream.getTracks().forEach(track => {
        con.conn.addTrack(track, stream.audioStream);
    })
    
}


// console.log(screenShare)
// console.log(stream.videoStream)

messenger.startListner( (msg) => {
        switch (msg.type) {
            case "offer":
                console.log("offer recieved");
                con.recieveOffer(msg);
                break;
            case "answer":
                console.log("answer recieved");
                con.recieveAnswer(msg);
                break;
            case "candidate":
                console.log("candidate recieved");
                con.handleCandidate(msg);
                break;
            case "startstream":
                console.log("startstream recieved");
                // startmystream();
                break;
            case "reoffer":
                console.log("reoffer recieved");
                // renegotiateanswer(msg);
                break;
            default:
                console.log(msg)
        }
    }
)}
start()