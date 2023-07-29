let mediaStream;
async function start(){
    const startaudio=document.getElementById('startaudio');
    const stopaudio=document.getElementById('stopaudio');
    const startvideo=document.getElementById('startvideo');
    const stopvideo=document.getElementById('stopvideo');
    const audiooptions=document.getElementById('audiooptions');
    const audiooutputoptions=document.getElementById('audiooutputoptions');
    const videooptions=document.getElementById('videooptions');
    console.log(startaudio,stopaudio,startvideo,stopvideo)
     mediaStream=await startStream();
    
     
    startaudio.addEventListener('click',async ()=>{
        startAudio(mediaStream)
    })
    stopaudio.addEventListener('click',async ()=>{
        console.log('stop audio', mediaStream)
        stopAudio(mediaStream)
    }
    )
    startvideo.addEventListener('click',async ()=>{
        startVideo(mediaStream)
    }
    )
    stopvideo.addEventListener('click',async ()=>{
        stopVideo(mediaStream)
    }
    )
    const audiodevices=await getMediaDevices('audioinput');
    const audiooutputdevices=await getMediaDevices('audiooutput');
    const videodevices=await getMediaDevices('videoinput');
    audiodevices.forEach(device=>{
        const option=document.createElement('option');
        option.value=device.deviceId;
        option.text=device.label;
        audiooptions.appendChild(option)
    })
    audiooutputdevices.forEach(device=>{
        const option=document.createElement('option');
        option.value=device.deviceId;
        option.text=device.label;
        audiooutputoptions.appendChild(option)
    })
    videodevices.forEach(device=>{  
        const option=document.createElement('option');
        option.value=device.deviceId;
        option.text=device.label;
        videooptions.appendChild(option)
    })

    audiooptions.addEventListener('change',async ()=>{
        const deviceId=audiooptions.value;
        changeAudioDevice(deviceId,mediaStream)
    })
    audiooutputoptions.addEventListener('change',async ()=>{
        const deviceId=audiooutputoptions.value;
        changeAudioOutputDevice(deviceId)
    })
    videooptions.addEventListener('change',async ()=>{
        const deviceId=videooptions.value;
        changeVideoDevice(deviceId,mediaStream)
    })
    
}


start()


