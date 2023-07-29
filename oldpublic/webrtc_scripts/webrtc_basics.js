async function getMediaDevices(devicetype){
    const devices=await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device=>device.kind===devicetype);
}



async function startStream(){
    const audioStream=await navigator.mediaDevices.getUserMedia({audio:{
        deviceId: {
            // exact: 'aab7f191376d6a92ee13f1b0e97e57e1085e399b96024b56365955679bdb7bd4'
            exact: 'default'
        }
    
    }});
    const videoConstraints = {
        width: { ideal: 1280 },  // Set the desired width (e.g., 1280 pixels)
        height: { ideal: 720 },   // Set the desired height (e.g., 720 pixels)
        frameRate: { ideal: 30 }, // Set the desired frame rate (e.g., 30 frames per second)
        // Add other desired constraints as needed
      };
      const audioConstraints = {
        audio: {
          echoCancellation: true, // Enable echo cancellation (if supported)
          autoGainControl: false, // Disable automatic gain control
          noiseSuppression: true, // Enable noise suppression (if supported)
          sampleRate: 48000, // Set the desired sample rate (e.g., 48kHz)
          channelCount: 2, // Set the desired channel count (e.g., stereo)
          bitrate: 128000, // Set the desired audio bitrate (e.g., 128kbps)
        },
      };
      
    //   use these video videoConstraints
    const videoStream=await navigator.mediaDevices.getUserMedia({video:true});
    const mediaStream=new MediaStream([...audioStream.getTracks(),...videoStream.getTracks()]);
    const video = document.querySelector('video');  
    video.srcObject = videoStream;
    return mediaStream
}
function stopVideo(mediaStream){
    mediaStream.getTracks().forEach(track=>{
        if(track.kind==='video'){ 
              track.enabled = false;
              track.stop()
              mediaStream.removeTrack(track)
        }
     })
}
async function startVideo(mediaStream){
    const videoStream=await navigator.mediaDevices.getUserMedia({video:true});
    mediaStream.addTrack(videoStream.getTracks()[0])

}
function stopAudio(mediaStream){
    mediaStream.getTracks().forEach(track=>{
        if(track.kind==='audio'){
            track.stop()
            mediaStream.removeTrack(track)
        }
    })
}
async function startAudio(mediaStream){
    const audioStream=await navigator.mediaDevices.getUserMedia({audio:{
        deviceId: {
            exact: 'default'
        }
    }
    })
    mediaStream.addTrack(audioStream.getTracks()[0])
}
async function changeAudioDevice(deviceId,mediaStream){
    mediaStream.getTracks().forEach(track=>{
        if(track.kind==='audio'){
            track.stop()
            mediaStream.removeTrack(track)
        }
    })
    const audioStream=await navigator.mediaDevices.getUserMedia({audio:{
        deviceId: {
            exact: deviceId
        }
    }
    })
    mediaStream.addTrack(audioStream.getTracks()[0])
}
async function changeVideoDevice(deviceId,mediaStream){
    mediaStream.getTracks().forEach(track=>{
        if(track.kind==='video'){
            track.stop()
            mediaStream.removeTrack(track)
        }
    })
    const videoStream=await navigator.mediaDevices.getUserMedia({video:{
        deviceId: {
            exact: deviceId
        }
    }
    })
    mediaStream.addTrack(videoStream.getTracks()[0])
}
async function changeAudioOutputDevice(deviceId){
    const video = document.querySelector('video');
    video.setSinkId(deviceId)
}

// async function changeMediaDevice(deviceId,deviceType){
//     if(deviceType==='audio'){
//         const mediaStream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:deviceId}});
//         const video = document.querySelector('video');
//         video.srcObject = mediaStream;
//         video.play();
//     }
// }