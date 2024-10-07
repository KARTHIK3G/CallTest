let localPeerConnection;
let localStream;

// Create an offer
document.getElementById('createOffer').addEventListener('click', async () => {
  localPeerConnection = new RTCPeerConnection();

  // Get audio stream
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  localPeerConnection.addStream(localStream);

  localPeerConnection.onicecandidate = event => {
    if (event.candidate) {
      document.getElementById('localCandidate').value = JSON.stringify(event.candidate);
    }
  };

  localPeerConnection.onaddstream = event => {
    document.getElementById('remoteAudio').srcObject = event.stream;
  };

  const offer = await localPeerConnection.createOffer();
  await localPeerConnection.setLocalDescription(offer);

  document.getElementById('localDescription').value = JSON.stringify(localPeerConnection.localDescription);
});

// Create an answer
document.getElementById('createAnswer').addEventListener('click', async () => {
  const remoteDescription = JSON.parse(document.getElementById('remoteDescription').value);

  localPeerConnection = new RTCPeerConnection();

  // Get audio stream
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  localPeerConnection.addStream(localStream);

  localPeerConnection.onicecandidate = event => {
    if (event.candidate) {
      document.getElementById('localCandidate').value = JSON.stringify(event.candidate);
    }
  };

  localPeerConnection.onaddstream = event => {
    document.getElementById('remoteAudio').srcObject = event.stream;
  };

  await localPeerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription));

  const answer = await localPeerConnection.createAnswer();
  await localPeerConnection.setLocalDescription(answer);

  document.getElementById('localDescription').value = JSON.stringify(localPeerConnection.localDescription);
});

// Set remote description (offer or answer)
document.getElementById('setRemoteDescription').addEventListener('click', async () => {
  const remoteDescription = JSON.parse(document.getElementById('remoteDescription').value);
  await localPeerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription));
});

// Add remote ICE candidate
document.getElementById('addRemoteCandidate').addEventListener('click', async () => {
  const candidate = JSON.parse(document.getElementById('remoteCandidate').value);
  await localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

// Start call (for offer creation)
document.getElementById('startCall').addEventListener('click', () => {
  alert('Call started');
});

// End call
document.getElementById('endCall').addEventListener('click', () => {
  localPeerConnection.close();
  alert('Call ended.');
});
