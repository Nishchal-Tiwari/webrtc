const arr=[]
const buf_arr=[]
const speed=document.querySelector('#speed')
const datareached=document.querySelector('#datareach')
let length=0
let prevlength=0
setInterval(() => {
    speed.innerText=((length-prevlength)/1024/1024).toFixed(2)+' MB/s'
    prevlength=length
}, 1000);
class rtc{
    rtcconfig={
        iceServers:[
            {
                urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]
      }
    incomingChannel=null
    outgoingChannel=null
    reciversStream=new MediaStream()
    constructor(config,socket){
        this.socket = socket
        if(socket==null)
            console.error('socket not provided || NEED A CONNECTION TO TALK')
        if(config)
            this.rtcconfig = config;
        this.conn=new RTCPeerConnection(this.rtcconfig);
        this.conn_init()
    }
    conn_init(){
        this.conn.ontrack=e=>this.trackhandler(e)
        this.conn.onnegotiationneeded=()=>this.handleRenegotiate()
        this.conn.onicecandidate=e=>this.handleicecandidate(e)
        this.conn.onconnectionstatechange=e=>this.handleconnection(e)
        this.conn.ondatachannel=e=>this.handledatachannel(e)
    }
    trackhandler(e){
        console.log('recieved terack')
        console.log(e.streams[0])
        console.log('//')
        arr.push(e.streams[0])
        this.reciversStream=e.streams[0]
        callervid.srcObject=this.reciversStream
    }
    handleRenegotiate(){
        if(this.conn.connectionState=='connected'){
            this.createOffer()
        }
        console.log('renegotiate')
    }
    handleicecandidate(e){
        console.log(e)
        const ice={
            type:'candidate',
            candidate:null,
        }
        if(e.candidate){
            ice.candidate=e.candidate.candidate;
            ice.sdpMid=e.candidate.sdpMid;
            ice.sdpMLineIndex=e.candidate.sdpMLineIndex;
        }
        this.socket.send(ice)
    }
    handleconnection(e){
        console.log(this.conn.connectionState)
    }
    handledatachannel(e){
        // e=e.channel;


        console.log(e)
        this.incomingChannel=e.channel
        this.incomingChannel.onopen=()=>console.log('|| data channel recieved from other peer ||')
        this.incomingChannel.onclose=()=>console.log('|| data channel closed from other peer ||')
        this.incomingChannel.onmessage=e=>this.handleMessageFromPeer(e)
    }
    handleMessageFromPeer(e){
        length+=e.data.byteLength
        buf_arr.push(e.data)
        datareached.innerText=(length/1024/1024).toFixed(2)+' MB'
        
        if(e.data==='end'){
            const download=new Blob(buf_arr)
            const url=URL.createObjectURL(download)
            const a=document.createElement('a')
            a.href=url
            a.innerText='download'
            a.setAttribute('download','')
            document.querySelector('body').appendChild(a)
        }
        console.log(e.data)
    }

    async connect(){
        this.outgoingChannel=await this.conn.createDataChannel('data')
        this.outgoingChannel.binaryType='arraybuffer'
        this.createOffer()
    }
    async createOffer(){
        const offer = await this.conn.createOffer()
        await this.conn.setLocalDescription(offer)
        this.socket.send({
            type: 'offer',
            sdp: offer.sdp,
        })
    }
    async recieveOffer(offer){
        this.outgoingChannel=await this.conn.createDataChannel('data')
        this.outgoingChannel.binaryType='arraybuffer'
        await this.conn.setRemoteDescription(offer)
        const answer = await this.conn.createAnswer()
        await this.conn.setLocalDescription(answer)
        this.socket.send({
            type:'answer',
            sdp:answer.sdp
        })
    }
    async recieveAnswer(answer){
        if(this.conn.signalingState=='stable'){
            alert('offer not created and user trying to set answer')
            return
        }
        console.log('answer set up')
        await this.conn.setRemoteDescription(answer)
    }
    handleCandidate = async e => {
        if(!this.conn){
            console.error('no connection')
            return  
        }
        if(!e.candidate){
            await this.conn.addIceCandidate(null)
        }
        else{
            await this.conn.addIceCandidate(e)
        }
    
    }
    stopVideo(stream){
        this.conn.getSenders().forEach(sender => {
            if(sender.kind=='video')
            this.conn.removeTrack(sender);
          });
        stream.stopVideo();
    }
    async startVideo(stream){
        this.conn.getSenders().forEach(sender => {
            if(sender.kind=='video')
            conn.removeTrack(sender);
        });
        await stream.startVideo();
        stream.videoStream.getTracks().forEach(track => {
            this.conn.addTrack(track, stream.videoStream);
        })
    }



    async senddata(file){
        console.log(file)
        const filereader=new FileReader()
        let offset = 0;
        
        const chunkSize = 16384;
        const readSlice = o => {
            console.log('readSlice ', o);
            const slice = file.slice(offset, o + chunkSize);
            filereader.readAsArrayBuffer(slice);
          };
        filereader.onload=(e)=>{
            this.outgoingChannel.send(e.target.result)
            offset+=e.target.result.byteLength
            if(offset<file.size){
                // setTimeout(() => readSlice(offset), 0.5);
                // readSlice(offset)

                if (this.outgoingChannel.bufferedAmount <= this.outgoingChannel.bufferedAmountLowThreshold) {
                    // this.outgoingChannel.send(data);
                    
                   
                        readSlice(offset);
                    
                } else {
                    this.outgoingChannel.onbufferedamountlow = () => {
                        this.outgoingChannel.onbufferedamountlow = null; // Reset the event handler to avoid multiple firings.
                        readSlice(offset);
                    };
                }



            }

        }
        
        readSlice(0)
    }
}   
