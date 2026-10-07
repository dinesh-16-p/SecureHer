import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Heart, Pill, Stethoscope, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

const HealthCalendarPage = () => {
  const { periods, moods, medications, appointments } = useHealth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format date as YYYY-MM-DD
  const formatYMD = (day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Check what events fall on a given date
  const getDayEvents = (day) => {
    const ymd = formatYMD(day);

    // Check Period
    const hasPeriod = periods.some((p) => {
      if (!p.startDate) return false;
      const start = new Date(p.startDate);
      const target = new Date(ymd);
      const diffDays = Math.floor((target - start) / (1000 * 60 * 60 * 24));
      const cycleLength = Number(p.cycleLength) || 28;
      const periodLen = Number(p.periodLength) || 5;
      if (diffDays >= 0) {
        const modDay = diffDays % cycleLength;
        return modDay < periodLen;
      }
      return false;
    });

    // Check Mood
    const dayMoods = moods.filter((m) => m.date === ymd);

    // Check Medications (active medications)
    const hasMed = medications.length > 0;

    // Check Appointments
    const dayAppts = appointments.filter((a) => a.date === ymd);

    return {
      hasPeriod,
      dayMoods,
      hasMed,
      dayAppts
    };
  };

  const selectedEvents = getDayEvents(selectedDay);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={CalendarIcon}>
          Unified Schedule
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Health & Wellness Calendar
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Synchronized schedule displaying your authentic period phases, daily medications, and clinical appointments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Calendar Grid */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="lg">
            {/* Month Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {monthNames[month]} {year}
                </h3>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button onClick={prevMonth} style={{ padding: '0.35rem', borderRadius: '4px', border: '1px solid rgba(246, 221, 229, 0.9)', background: '#fff', cursor: 'pointer' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={nextMonth} style={{ padding: '0.35rem', borderRadius: '4px', border: '1px solid rgba(246, 221, 229, 0.9)', background: '#fff', cursor: 'pointer' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D92D3A' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D92D3A' }} /> Period
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} /> Mood
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-health)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-health)' }} /> Medication
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} /> Doctor Visit
                </span>
              </div>
            </div>

            {/* Days of Week */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '0.25rem 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
              {/* Blank leading days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty_${i}`} style={{ minHeight: '60px', opacity: 0 }} />
              ))}

              {/* Real Days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isSelected = day === selectedDay;
                const events = getDayEvents(day);

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minHeight: '65px',
                      backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-background)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid rgba(246, 221, 229, 0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? 800 : 600, color: 'var(--color-primary)', textAlign: 'right' }}>
                      {day}
                    </span>

                    {/* Event Indicator Dots */}
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {events.hasPeriod && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D92D3A' }} />}
                      {events.dayMoods.length > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />}
                      {events.hasMed && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-health)' }} />}
                      {events.dayAppts.length > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Details Panel */}
        <div style={{ gridColumn: 'span 12 / span 4' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Schedule for {monthNames[month]} {selectedDay}, {year}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {selectedEvents.hasPeriod && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(217, 45, 58, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #D92D3A' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D92D3A' }}>Period Flow Active</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated active menstrual flow day</span>
                </div>
              )}

              {selectedEvents.dayMoods.map((m) => (
                <div key={m.id} style={{ padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-secondary)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    Mood Log: {m.emoji} {m.mood}
                  </div>
                  {m.note && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>"{m.note}"</span>}
                </div>
              ))}

              {medications.length > 0 && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-health)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>Daily Medication</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                    {medications.map((med) => (
                      <span key={med.id} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        • {med.name} ({med.time})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvents.dayAppts.map((appt) => (
                <div key={appt.id} style={{ padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    Doctor Appointment: {appt.doctor}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Time: {appt.time} • {appt.location || appt.specialty}
                  </span>
                </div>
              ))}

              {!selectedEvents.hasPeriod &&
                selectedEvents.dayMoods.length === 0 &&
                medications.length === 0 &&
                selectedEvents.dayAppts.length === 0 && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No specific events logged for this date.
                  </p>
                )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthCalendarPage;
