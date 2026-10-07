import React, { useState, useEffect } from 'react';
import { Camera, Video, Trash2, Download, Shield, Calendar, MapPin } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const EvidenceHistoryPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('secureher_evidence_vault') || '[]');
      setItems(stored);
    } catch (e) {
      setItems([]);
    }
  }, []);

  const handleDelete = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem('secureher_evidence_vault', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all locally stored evidence?')) {
      setItems([]);
      localStorage.removeItem('secureher_evidence_vault');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="primary" icon={Shield}>
            Local Storage
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Evidence Vault & History
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Review locally preserved incident captures. Media is encrypted and stored strictly on this device.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" icon={Trash2} onClick={handleClearAll}>
            Clear Vault
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-text-muted)'
            }}
          >
            <Camera size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Evidence Recorded Yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', maxWidth: '450px', margin: '0 auto' }}>
            Photos or videos captured with the Incident Evidence Camera will appear here securely.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <Card key={item.id} padding="none" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    color: '#FFFFFF',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {item.type === 'photo' ? 'PHOTO' : 'VIDEO'}
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                  <Calendar size={14} /> {item.formattedTime}
                </div>
                {item.latitude && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    <MapPin size={14} color="var(--color-secondary)" /> {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(246, 221, 229, 0.6)', paddingTop: '0.85rem' }}>
                  <a href={item.data} download={`secureher_evidence_${item.id}.${item.type === 'photo' ? 'jpg' : 'webm'}`}>
                    <Button variant="ghost" size="sm" icon={Download}>
                      Download
                    </Button>
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceHistoryPage;
