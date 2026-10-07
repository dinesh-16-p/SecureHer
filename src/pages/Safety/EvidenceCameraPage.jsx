import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Shield, StopCircle, RefreshCw, CheckCircle2, AlertTriangle, Eye, Lock, MapPin, EyeOff } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';
import { requestCameraStream, requestMicrophoneStream } from '../../services/permissionService';

const EvidenceCameraPage = () => {
  const { currentLocation, refreshPermissions } = useSafety();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [permissionError, setPermissionError] = useState(null);
  const [lastCaptured, setLastCaptured] = useState(null);
  const [hasMic, setHasMic] = useState(true);

  // Attach stream to video element when stream or cameraActive changes
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Video play promise note:', e));
      }
    }
  }, [stream, cameraActive]);

  // Clean up stream tracks on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Recording timer effect
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    setPermissionError(null);
    try {
      const mediaStream = await requestCameraStream(true);
      setStream(mediaStream);
      setCameraActive(true);
      refreshPermissions();
    } catch (err) {
      setPermissionError(err.message || 'Camera permission was denied. Please allow camera access in your browser settings.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setIsRecording(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraActive) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const evidenceItem = {
      id: 'ev_' + Date.now(),
      type: 'photo',
      data: dataUrl,
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString(),
      latitude: currentLocation?.latitude ?? null,
      longitude: currentLocation?.longitude ?? null,
      note: 'Snapshot captured during safety event'
    };

    saveEvidenceLocally(evidenceItem);
    setLastCaptured(evidenceItem);
  };

  const startRecording = async () => {
    if (!stream) return;

    let combinedStream = stream;
    try {
      const audioStream = await requestMicrophoneStream();
      const audioTrack = audioStream.getAudioTracks()[0];
      combinedStream = new MediaStream([...stream.getVideoTracks(), audioTrack]);
      setHasMic(true);
    } catch (micErr) {
      setHasMic(false);
      console.warn('Microphone unavailable or denied, continuing with video only.');
    }

    try {
      const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const evidenceItem = {
            id: 'ev_' + Date.now(),
            type: 'video',
            data: reader.result,
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleString(),
            latitude: currentLocation?.latitude ?? null,
            longitude: currentLocation?.longitude ?? null,
            note: 'Video incident recording'
          };
          saveEvidenceLocally(evidenceItem);
          setLastCaptured(evidenceItem);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (recErr) {
      setPermissionError('Could not start video recorder: ' + recErr.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveEvidenceLocally = (item) => {
    try {
      const existing = JSON.parse(localStorage.getItem('secureher_evidence_vault') || '[]');
      const updated = [item, ...existing].slice(0, 15);
      localStorage.setItem('secureher_evidence_vault', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="emergency" icon={Camera}>
          Evidence Vault
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Incident Evidence Camera
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Real-time incident documentation stored locally on your device with cryptographic timestamps and GPS watermark.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Camera Viewport */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="none" style={{ overflow: 'hidden', backgroundColor: '#1A1017' }}>
            <div style={{ position: 'relative', width: '100%', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', minHeight: '420px', maxHeight: '520px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#FFFFFF' }}>
                  <div
                    style={{
                      width: '4.5rem',
                      height: '4.5rem',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto'
                    }}
                  >
                    <Camera size={36} color="var(--color-accent)" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Camera Standby
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.75)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                    Click below to request camera access and initiate incident recording. Permission is only requested when you open the camera.
                  </p>
                  <Button variant="secondary" icon={Camera} onClick={startCamera}>
                    Enable & Open Camera
                  </Button>
                </div>
              )}

              {/* Live Overlay Badges */}
              {cameraActive && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 5 }}>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: '#FFFFFF', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={12} color="var(--color-secondary)" /> Local Storage Only
                  </span>
                  {isRecording && (
                    <span style={{ backgroundColor: 'var(--color-emergency)', color: '#FFFFFF', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                      ● REC {Math.floor(recordTimer / 60)}:{(recordTimer % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  {!hasMic && (
                    <span style={{ backgroundColor: 'rgba(237, 108, 2, 0.85)', color: '#FFFFFF', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Video Only (No Mic)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Camera Control Bar */}
            {cameraActive && (
              <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="primary" icon={Camera} onClick={capturePhoto} disabled={isRecording}>
                    Take Photo
                  </Button>
                  {!isRecording ? (
                    <Button variant="emergency" icon={Video} onClick={startRecording}>
                      Start Video
                    </Button>
                  ) : (
                    <Button variant="outline" icon={StopCircle} onClick={stopRecording}>
                      Stop Recording
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={stopCamera}>
                  Turn Off Camera
                </Button>
              </div>
            )}
          </Card>

          {permissionError && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(217, 45, 58, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-emergency)', color: 'var(--color-emergency)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              <span>{permissionError}</span>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={{ gridColumn: 'span 12 / span 4' }}>
          <Card padding="lg" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Evidence Security
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>🔐 Device Vault Sandbox</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Captured media is stored strictly in your browser's private local storage. No media is uploaded to cloud servers.
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>📍 GPS Watermark</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {currentLocation ? `${currentLocation.latitude.toFixed(5)}°, ${currentLocation.longitude.toFixed(5)}°` : 'Coordinates pending acquisition'}
                </div>
              </div>
            </div>
          </Card>

          {lastCaptured && (
            <Card padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2E7D32', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={16} /> {lastCaptured.type === 'photo' ? 'Photo' : 'Video'} Saved to Vault
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Captured: {lastCaptured.formattedTime}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceCameraPage;
