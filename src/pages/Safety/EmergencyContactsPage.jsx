import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const EmergencyContactsPage = () => {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Mother', phone: '+1 987 654 3210', email: 'mother@example.com', relationship: 'Parent', priority: 1 },
    { id: '2', name: 'Sister', phone: '+1 876 543 2109', email: 'sister@example.com', relationship: 'Sibling', priority: 2 }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', relationship: 'Family' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    setContacts([
      ...contacts,
      { ...newContact, id: Date.now().toString(), priority: contacts.length + 1 }
    ]);
    setNewContact({ name: '', phone: '', email: '', relationship: 'Family' });
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
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
            Manage contacts who receive automatic SOS alerts with your live location.
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Contact'}
        </Button>
      </div>

      {showAdd && (
        <Card padding="lg" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Add Emergency Contact
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Full Name *"
              required
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              required
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
            />
            <Button type="submit" variant="secondary" size="md">
              Save Contact
            </Button>
          </form>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {contacts.map((contact) => (
          <Card key={contact.id} hoverEffect={true} padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
                  Priority #{contact.priority}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {contact.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{contact.relationship}</span>
              </div>
              <button
                onClick={() => handleDelete(contact.id)}
                style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-secondary)" /> {contact.phone}
              </div>
              {contact.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="var(--color-primary)" /> {contact.email}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContactsPage;
