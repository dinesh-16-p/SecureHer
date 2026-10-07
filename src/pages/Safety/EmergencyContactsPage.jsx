import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, Trash2, Edit2, ShieldAlert, CheckCircle2, Heart } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';

const EmergencyContactsPage = () => {
  const { emergencyContacts, contactsLoading, addContact, removeContact } = useSafety();

  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'Family'
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      setErrorMsg('Name and phone number are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await addContact(newContact);
      setNewContact({ name: '', phone: '', email: '', relationship: 'Family' });
      setShowAdd(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save emergency contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this emergency contact?')) {
      try {
        await removeContact(id);
      } catch (err) {
        console.error('Failed to remove contact:', err);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="secondary" icon={Users}>
            Emergency Circle
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Trusted Emergency Contacts
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Contacts configured here will receive your automated SOS alerts with your real-time GPS location.
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Emergency Contact'}
        </Button>
      </div>

      {showAdd && (
        <Card padding="lg" style={{ marginBottom: '2rem', border: '2px solid var(--color-secondary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Add Trusted Contact
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                required
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 555 123 4567"
                required
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Emergency Email (for SOS) *
              </label>
              <input
                type="email"
                placeholder="e.g. contact@gmail.com"
                required
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Relationship
              </label>
              <select
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', background: '#fff', outline: 'none' }}
              >
                <option value="Family">Family</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Partner">Partner</option>
                <option value="Friend">Friend</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Emergency Contact'}
              </Button>
            </div>
          </form>

          {errorMsg && (
            <p style={{ color: 'var(--color-emergency)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              {errorMsg}
            </p>
          )}
        </Card>
      )}

      {contactsLoading ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading emergency contacts...</p>
        </Card>
      ) : emergencyContacts.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(199, 91, 122, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-secondary)'
            }}
          >
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Emergency Contacts Yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Add at least one trusted contact with their email and phone number to receive immediate SOS alerts with your GPS location.
          </p>
          <Button variant="primary" icon={UserPlus} onClick={() => setShowAdd(true)}>
            Add First Contact
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {emergencyContacts.map((contact, index) => (
            <Card key={contact.id} hoverEffect={true} padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: index === 0 ? 'var(--color-secondary)' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {index === 0 ? '★ Primary Contact' : `Priority #${index + 1}`}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {contact.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{contact.relationship}</span>
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  title="Remove Contact"
                  style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                <a href={`tel:${contact.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                  <Phone size={16} color="var(--color-secondary)" /> {contact.phone}
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                    <Mail size={16} color="var(--color-primary)" /> {contact.email}
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsPage;
