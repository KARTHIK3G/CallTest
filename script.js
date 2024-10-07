let localPeerConnection;
let remoteStream = new MediaStream();

// Get audio input from the user
async function getAudioStream() {
    try {
        return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
        alert('Error accessing audio device: ' + error);
    }
}

// Create an offer
document.getElementById('createOffer').addEventListener('click', async () => {
    localPeerConnection = new RTCPeerConnection();

    // Add event listener for ICE candidates
    localPeerConnection.onicecandidate = event => {
        if (event.candidate) {
            document.getElementById('localCandidate').value = JSON.stringify(event.candidate);
        }
    };

    // Handle incoming stream
    localPeerConnection.ontrack = event => {
        remoteStream.addTrack(event.track);
        document.getElementById('remoteAudio').srcObject = remoteStream;
    };

    const localStream = await getAudioStream();
    localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));

    const offer = await localPeerConnection.createOffer();
    await localPeerConnection.setLocalDescription(offer);

    document.getElementById('localOffer').value = JSON.stringify(localPeerConnection.localDescription);
});

// Set the remote description
document.getElementById('setRemoteDescription').addEventListener('click', async () => {
    const remoteDescription = JSON.parse(document.getElementById('remoteDescription').value);
    await localPeerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription));
});

// Create an answer if an offer was set
document.getElementById('createAnswer').addEventListener('click', async () => {
    const localStream = await getAudioStream();
    localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));

    const answer = await localPeerConnection.createAnswer();
    await localPeerConnection.setLocalDescription(answer);

    document.getElementById('localOffer').value = JSON.stringify(localPeerConnection.localDescription);
});

// Add remote ICE candidate
document.getElementById('addRemoteCandidate').addEventListener('click', async () => {
    const candidate = JSON.parse(document.getElementById('remoteCandidate').value);
    await localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

// End call
document.getElementById('endCall').addEventListener('click', () => {
    if (localPeerConnection) {
        localPeerConnection.close();
        localPeerConnection = null;
        alert('Call ended.');
    }
});
