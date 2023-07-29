let conn
let sendmedium
let recievemedium
const ourtrack=[]
const servers = {
  iceServers:[
      {
          urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
  ]
}

const video1 = document.querySelector('.video2');
function createPeerConnection() {
    conn = new RTCPeerConnection(servers);
    conn.ontrack = e => {
       console.log(e)
       ourtrack.push(e.streams[0])
        console.log(ourtrack)
       console.log(e.streams.kind)
        video1.srcObject = e.streams[0];
        console.log('recieved teracks')

      console.log(e.streams[0].getVideoTracks().length==0&&e.streams[0].getAudioTracks().length==0)

        if(e.streams[0].getVideoTracks().length>0){
            const body=document.querySelector('body')
            const video=document.createElement('video')
            video.srcObject=e.streams[0]
            body.appendChild(video)
        }
      }

      conn.onnegotiationneeded = async () => {
         renegotiate()
      }
    conn.onicecandidate = e => {
        console.log(e, 'icecandidate')
      const message = {
        type: 'candidate',
        candidate: null,
      };
      
      conn.onconnectionstatechange = e => {console.log(e)
        if (conn.connectionState === 'connected') {
            console.log('connected')
        }
    }
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      // signaling.postMessage(message);
      socket.emit('msgtoroom', 'room1', message);
    };
  }


async function startit(){
    await createPeerConnection()
    sendmedium =  conn.createDataChannel('sendmedium');

    
    //   canvastream.getTracks().forEach(track => {
    //     console.log()
    //     conn.addTrack(track, canvastream);
    //     })
    mediaStream.getTracks().forEach(track => {
        conn.addTrack(track, mediaStream);
        })
    sendmedium.onopen = () => {}
    sendmedium.onclose = () => {}
    sendmedium.onmessage = e => {console.log(e);}
    console.log('start')
    const offer = await conn.createOffer();
    console.log(offer.sdp)
    // signaling.postMessage({
    //     type:'offer',
    //     sdp: offer.sdp,
    // })
    socket.emit('msgtoroom', 'room1', {
      type:'offer',
      sdp: offer.sdp,
  });
    await conn.setLocalDescription(offer);

  }
  async function addmediastream(){

    const stream1 = new MediaStream();
const stream2 = new MediaStream();

   


    conn.getSenders().forEach(sender => {
      this.conn.removeTrack(sender);
    });

    canvastream.getTracks().forEach(track => {
        mediaStream.addTrack(track);
        })
    
    mediaStream.getTracks().forEach(track => {
          this.conn.addTrack(track, mediaStream);
          
      })
      

      // stream1.getTracks().forEach(track => {
      //   conn.addTrack(track, stream1);
      // });
      
      // stream2.getTracks().forEach(track => {
      //   conn.addTrack(track, stream2);
      // });
    // startit()
    
  }
  async function recieve(offer){
    await createPeerConnection()
    mediaStream.getTracks().forEach(track => {
        conn.addTrack(track, mediaStream);
    })
    conn.ondatachannel = e => {
        recievemedium = e.channel;
        recievemedium.onopen = () => {}
        recievemedium.onclose = () => {}
        recievemedium.onmessage = e => {console.log(e);}
      }
      await conn.setRemoteDescription(offer);
        const answer = await conn.createAnswer();
        console.log(answer.sdp)
        // signaling.postMessage({
        //     type: 'answer',
        //     sdp: answer.sdp,
        // })
        socket.emit('msgtoroom', 'room1', {
          type: 'answer',
          sdp: answer.sdp,
      });
        await conn.setLocalDescription(answer);
  }
  async function recieveanswer(answer){
    try{
      console.log(conn.signalingState, 'signalingstate')
      if(conn.signalingState!='stable'){
      await conn.setRemoteDescription(answer);
      }
      else{
        conn.setLocalDescription({type: "rollback"}),
        conn.setRemoteDescription(description)
      }
  
  
  
  }catch(e){
      console.log(e)
    }
  }

 

async function renegotiate(){
    const offer = await conn.createOffer();
    conn.setLocalDescription(offer);
    const togive={
      type:'reoffer',
      sdp: offer.sdp,
  }

  socket.emit('msgtoroom', 'room1', togive);

}

async function renegotiateanswer(answer){
  answer.type='offer'
  await conn.setRemoteDescription(answer);
  const answers = await conn.createAnswer();
  socket.emit('msgtoroom', 'room1', {
    type: 'answer',
    sdp: answers.sdp,
});
  await conn.setLocalDescription(answers);
}