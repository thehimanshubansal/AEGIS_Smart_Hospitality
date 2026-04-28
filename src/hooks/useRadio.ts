// src/hooks/useRadio.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useRadio = (socket: Socket | null, channelId: string) => {
    const [isMicActive, setIsMicActive] = useState(false);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const audioRefs = useRef<{ [socketId: string]: HTMLAudioElement }>({});
    const shouldKeepMicOpenRef = useRef(false);

    const stopMic = useCallback(() => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
        setIsMicActive(false);
    }, []);

    const startMic = useCallback(async () => {
        if (localStreamRef.current) {
            setIsMicActive(true);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            
            // Add tracks to all existing peer connections
            // This will trigger 'onnegotiationneeded' automatically
            Object.values(peerConnectionsRef.current).forEach(pc => {
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
            });
            
            setIsMicActive(true);
        } catch (err) {
            shouldKeepMicOpenRef.current = false;
            console.error("Microphone access denied", err);
        }
    }, []);

    const createPeerConnection = useCallback((userId: string) => {
        const config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun.cloudflare.com:3478' }
            ]
        };
        const pc = new RTCPeerConnection(config);

        pc.onconnectionstatechange = () => {
            console.log(`[WebRTC] Connection state with ${userId}: ${pc.connectionState}`);
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`[WebRTC] ICE connection state with ${userId}: ${pc.iceConnectionState}`);
        };

        peerConnectionsRef.current[userId] = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('webrtc-ice-candidate', { target: userId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            if (!audioRefs.current[userId]) {
                const audio = new Audio();
                audio.autoplay = true;
                audio.style.display = 'none';
                document.body.appendChild(audio);
                audioRefs.current[userId] = audio;
            }
            audioRefs.current[userId].srcObject = event.streams[0];
            audioRefs.current[userId].play().catch(e => console.warn('Audio play block:', e));
        };

        pc.onnegotiationneeded = async () => {
            try {
                console.log(`[WebRTC] Negotiation needed for ${userId}`);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket?.emit('webrtc-offer', { target: userId, sdp: pc.localDescription });
            } catch (err) {
                console.error("[WebRTC] Negotiation error:", err);
            }
        };

        return pc;
    }, [socket]);

    useEffect(() => {
        if (!socket || !channelId) return;

        const peerConnections = peerConnectionsRef.current;
        const audioElements = audioRefs.current;

        socket.emit('join-radio-channel', channelId);

        socket.on('user-joined-radio', async (userId) => {
            console.log(`[WebRTC] User ${userId} joined radio channel`);
            const pc = createPeerConnection(userId);
            
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => {
                    pc.addTrack(track, localStreamRef.current!);
                });
            }
            // Negotiation will be triggered by onnegotiationneeded
        });

        socket.on('webrtc-offer', async ({ sdp, callerId }) => {
            console.log(`[WebRTC] Received offer from ${callerId}`);
            let pc = peerConnectionsRef.current[callerId];
            if (!pc) {
                pc = createPeerConnection(callerId);
            }
            
            if (localStreamRef.current) {
                const senders = pc.getSenders();
                localStreamRef.current.getTracks().forEach(track => {
                    if (!senders.find(s => s.track === track)) {
                        pc.addTrack(track, localStreamRef.current!);
                    }
                });
            }

            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc-answer', { target: callerId, sdp: pc.localDescription });
        });

        socket.on('webrtc-answer', async ({ sdp, answererId }) => {
            console.log(`[WebRTC] Received answer from ${answererId}`);
            const pc = peerConnectionsRef.current[answererId];
            if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        });

        socket.on('webrtc-ice-candidate', async ({ candidate, senderId }) => {
            const pc = peerConnectionsRef.current[senderId];
            if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        return () => {
            Object.values(peerConnections).forEach(pc => pc.close());
            peerConnectionsRef.current = {};
            Object.values(audioElements).forEach(audio => {
                audio.pause();
                audio.srcObject = null;
                audio.remove();
            });
            audioRefs.current = {};
            socket.off('user-joined-radio');
            socket.off('webrtc-offer');
            socket.off('webrtc-answer');
            socket.off('webrtc-ice-candidate');

            // Keep the mic state in sync when the transport channel changes.
            if (shouldKeepMicOpenRef.current) {
                localStreamRef.current?.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
                void startMic();
            }
        };
    }, [socket, channelId, createPeerConnection, startMic]);

    useEffect(() => {
        return () => {
            shouldKeepMicOpenRef.current = false;
            stopMic();
        };
    }, [stopMic]);

    const toggleMic = async () => {
        if (isMicActive) {
            shouldKeepMicOpenRef.current = false;
            stopMic();
        } else {
            shouldKeepMicOpenRef.current = true;
            await startMic();
        }
    };

    return { isMicActive, toggleMic };
};
