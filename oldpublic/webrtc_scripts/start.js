// // trying to render my video 
// // if(have a camera){render video to canvas} else {say no camera}

// // hasUserMedia() is a function that checks if the browser supports API that allows browser to access the user's camera and microphone.

// // function hasUserMedia() {     
// //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia 
// //        || navigator.mozGetUserMedia || navigator.msGetUserMedia; 
// //     return !!navigator.getUserMedia; 
// //  }
// //  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
// //  .then(function (stream) {
// //    var video = document.querySelector('video');
// //    // Insert the stream into the video tag
// //    video.srcObject = stream;
// //  })
// //  .catch(function (error) {
// //     // const ans=confirm('You have no camera or microphone');
// //     // console.log(ans)
// //    if(error.name === 'NotAllowedError') {
// //      alert('Access Denied please allow access to camera and microphone 👆  click on video option above');
// //      console.log('Permission Denied');
// //      window.location.href = "chrome://settings/content#media-stream-mic";
// //    }
// //  });
// //  navigator.mediaDevices.enumerateDevices().then(function(devices) {
// //     const camera = document.getElementById('cameras');
// //     const microphone = document.getElementById('microphones');
// //     const speakers = document.getElementById('speakers');
// //     console.log(devices)
// //     devices.forEach(function(device)    {
// //         if(device.kind === 'videoinput') {
// //             camera.innerHTML += device.label+`  ${device.deviceId}`+ '<br>';
// //         }
// //         if(device.kind === 'audioinput') {
// //             microphone.innerHTML += device.label+ `  ${device.deviceId}` +'<br>';
// //         }
// //         if(device.kind === 'audiooutput') {
// //             speakers.innerHTML += device.label + `  ${device.deviceId}`  +'<br>';
// //         }

// //     })
// //  })



// // navigator.mediaDevices.getDisplayMedia({ video: true })
// //   .then(function (stream) {
// //     var video = document.querySelector('video');
// //     // Insert the stream into the video tag
// //     video.srcObject = stream;
// //   })
// //   .catch(function (error) {
// //     // Error callback
// //     console.error('Error accessing screen sharing:', error);
// //   });

// async function getMediaDevices(devicetype){    //   type of devices are videoinput, audioinput, audiooutput 
//   try{
    
//     await navigator.mediaDevices.getUserMedia({  audio: true })   // ASK FOR PERMISSIONS
//   }catch(e){
//     console.log('Permission Denied');
//     // window.location.href = "chrome://settings/content#media-stream-mic";
//   }
//   try{
    
//     await navigator.mediaDevices.getUserMedia({  video: true })   // ASK FOR PERMISSIONS
//   }catch(e){
//     console.log('Permission Denied');
//     // window.location.href = "chrome://settings/content#media-stream-mic";
//   }
//   const devices = await navigator.mediaDevices.enumerateDevices();
//   const deviceInfos = devices.filter(device => device.kind === devicetype);
//   return deviceInfos;

// }
// console.log(getMediaDevices('audioinput'))