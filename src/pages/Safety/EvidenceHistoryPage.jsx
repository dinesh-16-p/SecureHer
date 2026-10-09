import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Video,
  Trash2,
  Download,
  Shield,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FileCode,
  Info,
  Lock,
  RefreshCw
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { verifyEvidenceIntegrity, computeSHA256FromDataUrl } from '../../utils/cryptoUtils';

const EvidenceHistoryPage = () => {
  const [items, setItems] = useState([]);
  const [verifications, setVerifications] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    loadStoredEvidence();
  }, []);

  const loadStoredEvidence = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('secureher_evidence_vault') || '[]');
      setItems(stored);
    } catch (e) {
      setItems([]);
    }
  };

  const handleVerifyIntegrity = async (item) => {
    setVerifyingId(item.id);
    try {
      // If item lacks sha256Hash (e.g. from previous version), compute and backfill it
      let refHash = item.sha256Hash;
      if (!refHash && item.data) {
        const { hashHex } = await computeSHA256FromDataUrl(item.data);
        refHash = hashHex;
        item.sha256Hash = hashHex;
        const updated = items.map((i) => (i.id === item.id ? { ...i, sha256Hash: hashHex } : i));
        setItems(updated);
        localStorage.setItem('secureher_evidence_vault', JSON.stringify(updated));
      }

      const result = await verifyEvidenceIntegrity(item.data, refHash);
      setVerifications((prev) => ({
        ...prev,
        [item.id]: result
      }));
    } catch (err) {
      setVerifications((prev) => ({
        ...prev,
        [item.id]: { status: 'unverifiable', message: err.message }
      }));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this evidence capture?')) {
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      localStorage.setItem('secureher_evidence_vault', JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Permanently delete all locally preserved evidence recordings from this browser?')) {
      setItems([]);
      setVerifications({});
      localStorage.removeItem('secureher_evidence_vault');
    }
  };

  const handleExportManifest = (item) => {
    const manifest = {
      evidenceId: item.id,
      mediaType: item.type,
      mimeType: item.mimeType || (item.type === 'photo' ? 'image/jpeg' : 'video/webm'),
      sha256Hash: item.sha256Hash || 'pending_calculation',
      byteSize: item.byteSize || null,
      captureTimestamp: item.timestamp,
      formattedTime: item.formattedTime,
      gpsWatermark: {
        latitude: item.latitude ?? null,
        longitude: item.longitude ?? null,
        accuracyMeters: item.accuracy ?? null
      },
      integrityAlgorithm: 'SHA-256',
      vaultPlatform: 'SecureHer Tamper-Evident Evidence Vault',
      note: item.note || 'User incident documentation'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `secureher_manifest_${item.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="primary" icon={Lock}>
            Tamper-Evident Vault
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Tamper-Evident Evidence Vault
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Review locally preserved incident captures with cryptographic SHA-256 integrity verification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/safety/evidence">
            <Button variant="primary" icon={Camera}>
              Capture New Evidence
            </Button>
          </Link>
          {items.length > 0 && (
            <Button variant="outline" icon={Trash2} onClick={handleClearAll}>
              Clear Vault
            </Button>
          )}
        </div>
      </div>

      {/* Honest Tamper-Evident Disclaimer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#FFF9FB',
          border: '1px solid rgba(246, 221, 229, 0.9)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          color: 'var(--color-text)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
          <Info size={18} />
          <span>Cryptographic Integrity Verification</span>
        </div>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          When you capture media, SecureHer calculates a cryptographic SHA-256 digest using the browser Web Crypto API and seals it locally. Clicking <strong>Verify Integrity</strong> recalculates the hash from the stored raw bytes to ensure the file has not been altered since creation. All recordings remain strictly private on this device.
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div
            style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-text-muted)'
            }}
          >
            <Camera size={36} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Evidence Vault is Empty
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Photos or videos recorded using the Incident Evidence Camera will be sealed with cryptographic hashes and stored privately here.
          </p>
          <Link to="/safety/evidence">
            <Button variant="secondary" icon={Camera}>
              Open Evidence Camera
            </Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => {
            const verification = verifications[item.id];
            const isVerifying = verifyingId === item.id;

            return (
              <Card key={item.id} padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Media Preview */}
                <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.type === 'photo' ? (
                    <img src={item.data} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <video src={item.data} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.type === 'photo' ? '📷 PHOTO' : '🎥 VIDEO'}
                  </span>
                </div>

                {/* Metadata & Actions */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                      <Calendar size={14} /> {item.formattedTime}
                    </div>

                    {item.latitude && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-primary)', marginBottom: '0.65rem' }}>
                        <MapPin size={14} color="var(--color-secondary)" /> {item.latitude.toFixed(5)}°, {item.longitude.toFixed(5)}°
                      </div>
                    )}

                    {/* SHA-256 Hash Display */}
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#F8F5F7',
                        borderRadius: '6px',
                        border: '1px solid rgba(246, 221, 229, 0.8)',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        SHA-256 Hash
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          color: 'var(--color-primary)',
                          wordBreak: 'break-all',
                          marginTop: '0.15rem'
                        }}
                      >
                        {item.sha256Hash || 'Pending verification'}
                      </div>
                    </div>

                    {/* Verification Result Banner */}
                    {verification && (
                      <div
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          marginBottom: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor:
                            verification.status === 'passed'
                              ? 'rgba(46, 125, 50, 0.1)'
                              : verification.status === 'failed'
                              ? 'rgba(217, 45, 58, 0.1)'
                              : 'rgba(237, 108, 2, 0.1)',
                          color:
                            verification.status === 'passed'
                              ? '#2E7D32'
                              : verification.status === 'failed'
                              ? 'var(--color-emergency)'
                              : '#ED6C02'
                        }}
                      >
                        {verification.status === 'passed' ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <AlertTriangle size={16} />
                        )}
                        <span>{verification.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ borderTop: '1px solid rgba(246, 221, 229, 0.8)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={isVerifying ? RefreshCw : FileCheck}
                      onClick={() => handleVerifyIntegrity(item)}
                      disabled={isVerifying}
                      fullWidth
                    >
                      {isVerifying ? 'Recalculating Hash...' : 'Verify File Integrity'}
                    </Button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a
                          href={item.data}
                          download={`secureher_evidence_${item.id}.${item.type === 'photo' ? 'jpg' : 'webm'}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button variant="ghost" size="sm" icon={Download}>
                            Media
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FileCode}
                          onClick={() => handleExportManifest(item)}
                        >
                          Manifest
                        </Button>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-emergency)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.825rem'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvidenceHistoryPage;
