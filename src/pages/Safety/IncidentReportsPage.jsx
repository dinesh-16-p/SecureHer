import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  MapPin,
  Shield,
  Download,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Filter,
  Info,
  Paperclip,
  Clock,
  Eye,
  Loader2,
  FileDown
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';
import {
  subscribeIncidentReports,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport
} from '../../services/firebase/firestoreService';
import {
  generateIncidentReportPdf,
  generateIncidentSummaryLogPdf
} from '../../services/pdf/incidentReportPdfService';

const INCIDENT_CATEGORIES = [
  'Harassment',
  'Stalking',
  'Threats',
  'Unsafe travel',
  'Suspicious activity',
  'Online abuse',
  'Other safety concern'
];

const IncidentReportsPage = () => {
  const { user, userProfile } = useAuth();
  const { currentLocation, primaryEmergencyContact } = useSafety();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [selectedReportView, setSelectedReportView] = useState(null);

  // PDF Download States
  const [generatingPdfId, setGeneratingPdfId] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [pdfFeedback, setPdfFeedback] = useState(null); // { type: 'success' | 'error', message: string }


  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form State
  const [incidentType, setIncidentType] = useState('Harassment');
  const [title, setTitle] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState(new Date().toTimeString().slice(0, 5));
  const [locationLabel, setLocationLabel] = useState('');
  const [includeGps, setIncludeGps] = useState(true);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('saved');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local evidence vault items for attachment
  const [vaultItems, setVaultItems] = useState([]);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState([]);

  // Subscribe to user's reports
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeIncidentReports(
      user.uid,
      (fetched) => {
        setReports(fetched);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching incident reports:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user?.uid]);

  // Load local vault items for attachment selection
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('secureher_evidence_vault') || '[]');
      setVaultItems(stored);
    } catch (e) {
      setVaultItems([]);
    }
  }, [showModal]);

  const handleOpenCreate = () => {
    setEditingReport(null);
    setTitle('');
    setIncidentType('Harassment');
    setIncidentDate(new Date().toISOString().split('T')[0]);
    setIncidentTime(new Date().toTimeString().slice(0, 5));
    setLocationLabel('');
    setDescription('');
    setNotes('');
    setStatus('saved');
    setSelectedEvidenceIds([]);
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (report) => {
    setEditingReport(report);
    setTitle(report.title || '');
    setIncidentType(report.incidentType || 'Harassment');
    const d = new Date(report.incidentAt || Date.now());
    setIncidentDate(d.toISOString().split('T')[0]);
    setIncidentTime(d.toTimeString().slice(0, 5));
    setLocationLabel(report.locationLabel || '');
    setDescription(report.description || '');
    setNotes(report.notes || '');
    setStatus(report.status || 'saved');
    setSelectedEvidenceIds(report.evidenceIds || []);
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Report title is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a detailed description of the incident.');
      return;
    }

    setIsSubmitting(true);
    try {
      const incidentTimestamp = new Date(`${incidentDate}T${incidentTime}`).toISOString();
      const reportData = {
        title: title.trim(),
        incidentType,
        incidentAt: incidentTimestamp,
        locationLabel: locationLabel.trim(),
        latitude: includeGps && currentLocation ? currentLocation.latitude : null,
        longitude: includeGps && currentLocation ? currentLocation.longitude : null,
        locationAccuracyMeters: includeGps && currentLocation ? Math.round(currentLocation.accuracy) : null,
        description: description.trim(),
        notes: notes.trim(),
        evidenceIds: selectedEvidenceIds,
        status
      };

      if (editingReport) {
        await updateIncidentReport(user.uid, editingReport.id, reportData);
      } else {
        await createIncidentReport(user.uid, reportData);
      }

      setShowModal(false);
    } catch (err) {
      setFormError(err.message || 'Error saving incident report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to permanently delete this incident report?')) {
      await deleteIncidentReport(user.uid, reportId);
      if (selectedReportView?.id === reportId) {
        setSelectedReportView(null);
      }
    }
  };

  /**
   * Generates and downloads a high-authority, human-readable PDF report
   */
  const handleDownloadPdf = async (report) => {
    if (!report) return;
    setGeneratingPdfId(report.id);
    setPdfFeedback(null);

    try {
      const pdfBlob = await generateIncidentReportPdf({
        report,
        user,
        userProfile,
        evidenceItems: vaultItems,
        emergencyContact: primaryEmergencyContact
      });

      const dateStamp = (report.incidentAt || new Date().toISOString()).slice(0, 10);
      const safeRef = (report.id || 'entry').slice(0, 8).toUpperCase();
      const filename = `SecureHer_Incident_Report_${safeRef}_${dateStamp}.pdf`;

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);

      setPdfFeedback({
        type: 'success',
        message: `Official PDF report downloaded successfully: ${filename}`
      });
      setTimeout(() => setPdfFeedback(null), 5000);
    } catch (err) {
      console.error('PDF generation error:', err);
      setPdfFeedback({
        type: 'error',
        message: `Failed to compile PDF report: ${err.message || 'Unknown error'}. Please check report contents.`
      });
      setTimeout(() => setPdfFeedback(null), 7000);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  /**
   * Generates and downloads an All-Incidents Summary Log PDF
   */
  const handleDownloadSummaryPdf = async () => {
    if (!reports || reports.length === 0) {
      setPdfFeedback({
        type: 'error',
        message: 'No incident reports recorded to summarize.'
      });
      setTimeout(() => setPdfFeedback(null), 5000);
      return;
    }

    setIsGeneratingSummary(true);
    setPdfFeedback(null);

    try {
      const pdfBlob = await generateIncidentSummaryLogPdf({
        reports,
        userProfile
      });

      const dateStamp = new Date().toISOString().slice(0, 10);
      const filename = `SecureHer_Master_Incident_Log_${dateStamp}.pdf`;

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);

      setPdfFeedback({
        type: 'success',
        message: `Master incident log summary downloaded successfully: ${filename}`
      });
      setTimeout(() => setPdfFeedback(null), 5000);
    } catch (err) {
      console.error('Summary PDF error:', err);
      setPdfFeedback({
        type: 'error',
        message: `Failed to generate master log summary: ${err.message}`
      });
      setTimeout(() => setPdfFeedback(null), 7000);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  /**
   * Optional technical raw JSON export (clearly labeled, separate from primary PDF report)
   */
  const handleExportJson = (report) => {
    const exportData = {
      reportId: report.id,
      title: report.title,
      incidentType: report.incidentType,
      incidentTimestamp: report.incidentAt,
      location: report.locationLabel,
      coordinates: report.latitude ? { latitude: report.latitude, longitude: report.longitude } : null,
      description: report.description,
      contextNotes: report.notes,
      evidenceAttachments: report.evidenceIds || [],
      status: report.status,
      exportedAt: new Date().toISOString(),
      disclaimer: 'Raw technical recordkeeping export generated by SecureHer AI-Based Women\'s Security Platform.'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `secureher_raw_data_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredReports = reports.filter((r) => {
    const matchesCategory = categoryFilter === 'All' || r.incidentType === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Badge variant="primary" icon={FileText}>
            Documentation & Records
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Safety Incident Reporting
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Create, manage, and export structured private documentation of safety concerns or incidents.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {reports.length > 0 && (
            <Button
              variant="outline"
              icon={isGeneratingSummary ? Loader2 : FileDown}
              disabled={isGeneratingSummary}
              onClick={handleDownloadSummaryPdf}
            >
              {isGeneratingSummary ? 'Compiling Log...' : 'Export Master Log (PDF)'}
            </Button>
          )}
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Create Incident Report
          </Button>
        </div>
      </div>

      {/* PDF Status / Feedback Notification Banner */}
      {pdfFeedback && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            backgroundColor: pdfFeedback.type === 'success' ? '#EDF7ED' : '#FDEDED',
            color: pdfFeedback.type === 'success' ? '#1E4620' : '#5F2120',
            border: `1px solid ${pdfFeedback.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          {pdfFeedback.type === 'success' ? (
            <CheckCircle2 size={18} color="#2E7D32" />
          ) : (
            <AlertCircle size={18} color="#D32F2F" />
          )}
          <span>{pdfFeedback.message}</span>
        </div>
      )}

      {/* Recordkeeping Legal Disclaimer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#FFF9FB',
          border: '1px solid rgba(246, 221, 229, 0.9)',
          borderLeft: '4px solid var(--color-secondary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          color: 'var(--color-text)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
          <Info size={18} color="var(--color-secondary)" />
          <span>Personal Recordkeeping & Privacy Notice</span>
        </div>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          This feature is an encrypted personal logbook for documenting safety incidents with verifiable timestamps and optional vault attachments. <strong>It does not automatically file a report with police or government agencies.</strong> For immediate emergencies, call <strong>112</strong> or activate Emergency SOS.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="md" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="var(--color-text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search reports by keyword, location, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(246, 221, 229, 0.9)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--color-text-muted)" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(246, 221, 229, 0.9)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Categories</option>
              {INCIDENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      {loading ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: 'var(--color-text-muted)' }}>Loading your incident records...</div>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <FileText size={36} color="var(--color-text-light)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Incident Reports Recorded
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Documenting incidents creates a structured timeline with optional GPS and evidence attachments.
          </p>
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Create First Report
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredReports.map((report) => (
            <Card key={report.id} padding="lg" hoverEffect={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Badge variant="secondary">
                    {report.incidentType}
                  </Badge>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: report.status === 'draft' ? '#ED6C02' : '#2E7D32'
                    }}
                  >
                    ● {report.status || 'saved'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  {report.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={13} /> {new Date(report.incidentAt).toLocaleDateString()} at {new Date(report.incidentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {report.locationLabel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={13} color="var(--color-secondary)" /> {report.locationLabel}
                    </div>
                  )}
                  {report.evidenceIds?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      <Paperclip size={13} /> {report.evidenceIds.length} Evidence Attachment(s)
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {report.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(246, 221, 229, 0.8)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={generatingPdfId === report.id ? Loader2 : FileDown}
                    disabled={generatingPdfId === report.id}
                    onClick={() => handleDownloadPdf(report)}
                  >
                    {generatingPdfId === report.id ? 'Compiling...' : 'PDF Report'}
                  </Button>
                  <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelectedReportView(report)}>
                    View
                  </Button>
                  <button
                    onClick={() => handleExportJson(report)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      padding: '0.25rem 0.4rem'
                    }}
                    title="Export Raw JSON Data"
                  >
                    JSON
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleOpenEdit(report)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.35rem' }}
                    title="Edit Report"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer', padding: '0.35rem' }}
                    title="Delete Report"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Detail Modal */}
      {selectedReportView && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(41, 33, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '580px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Badge variant="secondary">{selectedReportView.incidentType}</Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>
                    REF: SH-IR-{(selectedReportView.id || '').slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.35rem' }}>
                  {selectedReportView.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportView(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#FFF9FB', borderRadius: '8px' }}>
                <div>⏱️ <strong>Date & Time:</strong> {new Date(selectedReportView.incidentAt).toLocaleString()}</div>
                <div>📍 <strong>Location:</strong> {selectedReportView.locationLabel || 'Not specified'}</div>
                {selectedReportView.latitude && (
                  <div>🌐 <strong>GPS Fix:</strong> {selectedReportView.latitude.toFixed(5)}°, {selectedReportView.longitude.toFixed(5)}° (±{selectedReportView.locationAccuracyMeters}m)</div>
                )}
                <div>🛡️ <strong>Integrity Seal:</strong> SHA-256 Cryptographic Digest Ready</div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Incident Description
                </h4>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--color-text)', margin: 0 }}>
                  {selectedReportView.description}
                </p>
              </div>

              {selectedReportView.notes && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    Witness / Context Notes
                  </h4>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--color-text-muted)', margin: 0 }}>
                    {selectedReportView.notes}
                  </p>
                </div>
              )}

              {/* Evidence Vault Attachments Section */}
              {selectedReportView.evidenceIds?.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(246, 221, 229, 0.9)', paddingTop: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Paperclip size={15} /> Attached Evidence Vault Items ({selectedReportView.evidenceIds.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selectedReportView.evidenceIds.map((evId) => {
                      const match = vaultItems.find((v) => v.id === evId);
                      return (
                        <div
                          key={evId}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: '#FBF8F9',
                            borderRadius: '6px',
                            border: '1px solid rgba(246, 221, 229, 0.7)',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                            <span>{match ? match.type.toUpperCase() : 'Preserved Media'} — {evId}</span>
                            <span style={{ color: '#2E7D32' }}>SHA-256 Verified</span>
                          </div>
                          {match?.sha256Hash && (
                            <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#666', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                              Hash: {match.sha256Hash}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid rgba(246, 221, 229, 0.8)', paddingTop: '1rem' }}>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => handleExportJson(selectedReportView)}
                title="Download raw machine-readable JSON for developers"
              >
                Export JSON (Raw)
              </Button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="primary"
                  icon={generatingPdfId === selectedReportView.id ? Loader2 : FileDown}
                  disabled={generatingPdfId === selectedReportView.id}
                  onClick={() => handleDownloadPdf(selectedReportView)}
                >
                  {generatingPdfId === selectedReportView.id ? 'Generating...' : 'Download PDF Report'}
                </Button>
                <Button variant="ghost" onClick={() => setSelectedReportView(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(41, 33, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                {editingReport ? 'Edit Incident Report' : 'Document Safety Incident'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(217, 45, 58, 0.1)', color: 'var(--color-emergency)', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    Incident Category *
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', outline: 'none' }}
                  >
                    {INCIDENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    Record Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="saved">Saved Record</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Report Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Unsafe encounter near Metro station"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    Time *
                  </label>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Location / Address Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Corner of 5th Ave and Maple St."
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {currentLocation && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', cursor: 'pointer', color: 'var(--color-primary)' }}>
                  <input
                    type="checkbox"
                    checked={includeGps}
                    onChange={(e) => setIncludeGps(e.target.checked)}
                  />
                  <span>Attach current GPS coordinates ({currentLocation.latitude.toFixed(4)}°, {currentLocation.longitude.toFixed(4)}°)</span>
                </label>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Incident Description *
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe exactly what happened in clear, neutral detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Additional Notes (Witnesses, Vehicle details, Remarks)
                </label>
                <textarea
                  rows="2"
                  placeholder="Optional extra context, badge numbers, license plates, or names..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {vaultItems.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                    Attach Local Evidence Vault Captures
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '110px', overflowY: 'auto' }}>
                    {vaultItems.map((item) => (
                      <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedEvidenceIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvidenceIds([...selectedEvidenceIds, item.id]);
                            } else {
                              setSelectedEvidenceIds(selectedEvidenceIds.filter((id) => id !== item.id));
                            }
                          }}
                        />
                        <span>{item.type.toUpperCase()} ({item.formattedTime}) — {item.sha256Hash ? item.sha256Hash.slice(0, 12) + '...' : 'No hash'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingReport ? 'Update Record' : 'Save Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReportsPage;
