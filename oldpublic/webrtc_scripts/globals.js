class localStream{
    constructor(){
        this.mediaStream=new MediaStream()
        this.hasMic = getMicrophone()
        this.hasVid = getCamera()
        this.microphoneDevices=this.getMediaDevices('audioinput')
        this.cameraDevices=this.getMediaDevices('videoinput')
        this.speakerDevices=this.getMediaDevices('audiooutput')
    }
    async getMicrophone(deviceId){
        try{
            const config={
                deviceId:{
                    exact:deviceId?deviceId:'default',
                },
                echoCancellation: true, // Enable echo cancellation (if supported)
                autoGainControl: false, // Disable automatic gain control
                noiseSuppression: true, // Enable noise suppression (if supported)
                sampleRate: 48000, // Set the desired sample rate (e.g., 48kHz)
                channelCount: 2, // Set the desired channel count (e.g., stereo)
                bitrate: 128000,
            }
            this.audioStream=await navigator.mediaDevices.getUserMedia({audio:config})
            await this.flushMediaStream('audio')
            this.audioStream.getTracks().forEach(t=>this.mediaStream.addTrack(t))
            return true
        }
        catch(e){
            console.log('Acess Denied || No Microphone Present')
            this.audioStream=null
            return false
        }
    }
    async getCamera(deviceId){
        try{
            const config={
                deviceId:{
                    exact:deviceId?deviceId:'default',
                },
                width: { ideal: 1280 },  // Set the desired width (e.g., 1280 pixels)
                height: { ideal: 720 },   // Set the desired height (e.g., 720 pixels)
                frameRate: { ideal: 30 }, // Set the desired frame rate (e.g., 30 frames per second)
            }
            this.videoStream=await navigator.mediaDevices.getUserMedia({video:config})
            this.flushMediaStream('video')
            this.videoStream.getTracks().forEach(t=>this.mediaStream.addTrack(t))
            return true
        }
        catch(e){
            console.log('Acess Denied || No Camera Present')
            this.videoStream=null
            return false
        }
    }
    async flushMediaStream(type){
        this.mediaStream.getTracks().forEach(t=>{
            if(t.kind==type)
                this.mediaStream.removeTrack(t)
        })
    }
    async startStream(id){
        if(!this.hasMic)
            this.hasMic=await this.getMicrophone()
        if(!this.hasVid)
            this.hasVid=await this.getCamera()
        const video=document.getElementById(id)
        video.srcObj=this.videoStream
    }
    async startVideo(){
        await this.getCamera()
    }
    async startMicrophone(){
        await this.getMicrophone()
    }
    async stopVideo(){
        this.flushMediaStream('video')
        this.videoStream.getTracks().forEach(t=>{
            t.enabled=false
            t.stop()
        })
        this.hasVid=false
    }
    async stopAudio(){
        this.flushMediaStream('audio')
        this.audioStream.getTracks().forEach(t=>{
            t.enabled=false;
            t.stop()
        })
    }
    async  changeAudioOutputDevice(deviceId,videoid){
        const video = document.querySelector(videoid);
        video.setSinkId(deviceId)
    }
    async  getMediaDevices(devicetype){
        const devices=await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device=>device.kind===devicetype);
    }
}