class localStream{
    
    constructor(){
        this.init();
    }
    async init(){
        this.mediaStream=new MediaStream()
        this.videoStream=new MediaStream()
        this.audioStream=new MediaStream()
        this.screenStream=new MediaStream()
        this.audioConfig=null
        this.videoConfig=null
        this.isStreaming=null
        this.isSharingScreen=false
        this.microphoneDevices=await this.getMediaDevices('audioinput')
        this.cameraDevices=await this.getMediaDevices('videoinput')
        this.speakerDevices=await this.getMediaDevices('audiooutput')
    }
    async stopScreenShare(){
        this.isSharingScreen=false //
        this.screenStreacm.getTracks().forEach(t=>t.stop())
        this.screenStream=new MediaStream()
    }
    async getScreen(){
        try{
            const config={
                video:{
                    cursor:'always',
                    displaySurface:'monitor',
                    frameRate: 60,
                }
            }
            this.screenStream=await navigator.mediaDevices.getDisplayMedia(config)
            this.isSharingScreen=true
            return true
        }
        catch(e){
            console.log('Acess Denied || No Screen Present')
            this.screenStream=new MediaStream()
            return false
        }
    }
    async getMicrophone(deviceId){
        if(this.audioStream.active){
            await this.flushMediaStream('audio')
            this.audioStream.getTracks().forEach(t=>t.stop())
            this.audioStream.getTracks().forEach(t=>this.audioStream.removeTrack(t))

            }
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
            this.audioStream=new MediaStream()
            return false
        }
    }
    async getCamera(deviceId){
        if(this.videoStream.active){
        await this.flushMediaStream('video')
        this.videoStream.getTracks().forEach(t=>t.stop())
        this.videoStream.getTracks().forEach(t=>this.videoStream.removeTrack(t))
        }
        try{
            const config={
                
                // width: { ideal: 1280 },  // Set the desired width (e.g., 1280 pixels)
                // height: { ideal: 720 },   // Set the desired height (e.g., 720 pixels)
                // frameRate: { ideal: 30 }, // Set the desired frame rate (e.g., 30 frames per second)
            }
            if(deviceId){
                
                config['deviceId']={
                    exact:deviceId?deviceId:'default',
                }
            }
            this.videoStream=await navigator.mediaDevices.getUserMedia({video:config})
            this.flushMediaStream('video')
            this.videoStream.getTracks().forEach(t=>this.mediaStream.addTrack(t))
            if(this.isStreaming) {
                const vid=document.getElementById(this.isStreaming)
                vid.srcObject=this.videoStream
            }
            return true
        }
        catch(e){
            console.log('Acess Denied || No Camera Present',e)
            this.videoStream=new MediaStream()
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
        await Promise.all([this.getCamera(),this.getMicrophone(),])
        
        const video=document.getElementById(id)
        this.isStreaming=id
        video.autoplay=true
        video.srcObject=this.videoStream
        
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

    async changeCamera(deviceId,videoid){
        await this.getCamera(deviceId)
        const video = document.getElementById(videoid);
        video.srcObject=this.videoStream
    }
    async changeMicrophone(deviceId){
        await this.getMicrophone(deviceId)

    }
    
}

const callervid=document.querySelector('#callervid')
const uservid=document.querySelector('#uservid')

