const signaling = new BroadcastChannel('webrtc');

signaling.addEventListener('message', async e => {
    e=e.data
    if (e.type === 'offer') {
        await recieve(e)
    }
    if (e.type === 'answer') {
        await recieveanswer(e)
    }
    if (e.type === 'candidate') {
        handleCandidate(e)
    }
    if(e=='startstream'){
        startmystream()
    }
})


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

