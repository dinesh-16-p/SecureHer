import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

# Output directory
OUT_DIR = "Project_Reports"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs("public/assets", exist_ok=True)

# Common B&W styling
C_BG = '#FFFFFF'
C_BOX_BG = '#F8F8F8'
C_BORDER = '#000000'
C_TEXT = '#000000'

def save_fig(fig, filename):
    p1 = os.path.join(OUT_DIR, filename)
    p2 = os.path.join("public/assets", filename)
    fig.savefig(p1, dpi=300, bbox_inches='tight', facecolor=C_BG)
    fig.savefig(p2, dpi=300, bbox_inches='tight', facecolor=C_BG)
    plt.close(fig)
    print(f"Saved: {p1}")

# ═════════════════════════════════════════════════════════════════════════════
# FIG 2: MODULAR STRUCTURE OF SECUREHER
# ═════════════════════════════════════════════════════════════════════════════
def draw_fig2():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    # Root Box
    rect = patches.FancyBboxPatch((2.5, 3.8), 5.0, 0.9, boxstyle="square,pad=0.1",
                                  facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.5)
    ax.add_patch(rect)
    ax.text(5.0, 4.35, "SecureHer: Intelligent Real-Time Platform", ha='center', va='center',
            fontsize=11, fontweight='bold', color=C_TEXT)
    ax.text(5.0, 4.05, "Autonomous Women's Safety & Emergency Telematics", ha='center', va='center',
            fontsize=8.5, color=C_TEXT)

    # 4 Modules
    mods = [
        ("Module 1\nIngestion & Telemetry", ["GPS watchPosition", "WGS 84 Ellipsoid", "Progressive Lock", "Pin Calibration"], 0.3),
        ("Module 2\nMap & Civic Radar", ["MapLibre GL WebGL", "Missing Sprite Fix", "Overpass OSM API", "10km Hospital Quick"], 2.7),
        ("Module 3\nJourney Guardian", ["Active Commute ETA", "Modulo-24 Rollover", "60s Grace Countdown", "Auto-Escalation"], 5.1),
        ("Module 4\nSOS & Evidence", ["Android SmsManager", "Brevo REST Email", "Web Audio Siren", "SHA-256 Watermark"], 7.5),
    ]

    for title, items, x in mods:
        # Arrow down
        ax.annotate('', xy=(x + 1.1, 3.0), xytext=(5.0, 3.8),
                    arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))
        
        # Module box
        rect_m = patches.FancyBboxPatch((x, 1.8), 2.2, 1.2, boxstyle="square,pad=0.1",
                                        facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.2)
        ax.add_patch(rect_m)
        ax.text(x + 1.1, 2.65, title, ha='center', va='center', fontsize=9, fontweight='bold', color=C_TEXT)

        # Arrow to sub-box
        ax.annotate('', xy=(x + 1.1, 1.4), xytext=(x + 1.1, 1.8),
                    arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.0))

        # Details box
        rect_d = patches.FancyBboxPatch((x, 0.2), 2.2, 1.2, boxstyle="square,pad=0.08",
                                        facecolor='#FFFFFF', edgecolor=C_BORDER, linewidth=1.0)
        ax.add_patch(rect_d)
        for idx, it in enumerate(items):
            ax.text(x + 1.1, 1.15 - idx * 0.26, it, ha='center', va='center', fontsize=7.5, color=C_TEXT)

    save_fig(fig, "fig2_modular_structure.png")

# ═════════════════════════════════════════════════════════════════════════════
# FIG 3: DFD LEVEL 0 CONTEXT DIAGRAM
# ═════════════════════════════════════════════════════════════════════════
def draw_fig3():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    # Center process
    p_rect = patches.FancyBboxPatch((3.8, 1.8), 2.4, 1.4, boxstyle="square,pad=0.1",
                                    facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.5)
    ax.add_patch(p_rect)
    ax.text(5.0, 2.65, "0.0\nSecureHer Emergency\nPlatform", ha='center', va='center',
            fontsize=10, fontweight='bold', color=C_TEXT)

    # Entities
    # Left: Commuter User
    e_user = patches.Rectangle((0.4, 1.8), 2.2, 1.4, facecolor='#FFFFFF', edgecolor=C_BORDER, linewidth=1.2)
    ax.add_patch(e_user)
    ax.text(1.5, 2.5, "Commuter User\n(Woman in Distress)", ha='center', va='center', fontsize=8.5, fontweight='bold')

    # Top: Android OS / GNSS
    e_gps = patches.Rectangle((3.8, 3.8), 2.4, 0.9, facecolor='#FFFFFF', edgecolor=C_BORDER, linewidth=1.2)
    ax.add_patch(e_gps)
    ax.text(5.0, 4.25, "Android OS & GNSS\n(Hardware Telephony)", ha='center', va='center', fontsize=8.5, fontweight='bold')

    # Right: Trusted Guardians
    e_guard = patches.Rectangle((7.4, 1.8), 2.2, 1.4, facecolor='#FFFFFF', edgecolor=C_BORDER, linewidth=1.2)
    ax.add_patch(e_guard)
    ax.text(8.5, 2.5, "Trusted Guardians\n(Family & Contacts)", ha='center', va='center', fontsize=8.5, fontweight='bold')

    # Bottom: External APIs
    e_api = patches.Rectangle((3.8, 0.3), 2.4, 0.9, facecolor='#FFFFFF', edgecolor=C_BORDER, linewidth=1.2)
    ax.add_patch(e_api)
    ax.text(5.0, 0.75, "Brevo & Overpass APIs\n(Email & Civic Maps)", ha='center', va='center', fontsize=8.5, fontweight='bold')

    # Flows
    ax.annotate('1-Tap Panic / ETA', xy=(3.8, 2.7), xytext=(2.6, 2.7),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5, va='bottom')
    ax.annotate('Siren / GPS Status', xy=(2.6, 2.3), xytext=(3.8, 2.3),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5, va='top')
    
    ax.annotate('NMEA Satellite Fix', xy=(4.6, 3.2), xytext=(4.6, 3.8),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5)
    ax.annotate('Baseband SMS Trigger', xy=(5.4, 3.8), xytext=(5.4, 3.2),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5)

    ax.annotate('Direct GSM SMS', xy=(7.4, 2.7), xytext=(6.2, 2.7),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5, va='bottom')
    ax.annotate('HTML Alert Email', xy=(7.4, 2.3), xytext=(6.2, 2.3),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5, va='top')

    ax.annotate('REST Email / QL Query', xy=(4.6, 1.2), xytext=(4.6, 1.8),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5)
    ax.annotate('Civic Nodes JSON', xy=(5.4, 1.8), xytext=(5.4, 1.2),
                arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5)

    save_fig(fig, "fig3_dfd0.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 4: DFD LEVEL 1 DECOMPOSED SUBSYSTEMS
# ═════════════════════════════════════════════════════════════════════════
def draw_fig4():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    procs = [
        ("1.0 Ingestion\n& Telemetry", 0.5),
        ("2.0 Progressive\nGNSS & Map", 2.9),
        ("3.0 Active\nJourney Engine", 5.3),
        ("4.0 Multi-Channel\nSOS Dispatch", 7.7),
    ]

    for title, x in procs:
        r = patches.FancyBboxPatch((x, 1.8), 1.8, 1.2, boxstyle="square,pad=0.1",
                                   facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.2)
        ax.add_patch(r)
        ax.text(x + 0.9, 2.4, title, ha='center', va='center', fontsize=8.5, fontweight='bold')

    # Data Store D1: Local State
    ax.plot([1.5, 3.5], [0.6, 0.6], color=C_BORDER, lw=1.5)
    ax.plot([1.5, 3.5], [1.1, 1.1], color=C_BORDER, lw=1.5)
    ax.text(2.5, 0.85, "D1: Local Storage Cache", ha='center', va='center', fontsize=8, fontweight='bold')

    # Data Store D2: Cloud Firestore
    ax.plot([6.5, 8.5], [0.6, 0.6], color=C_BORDER, lw=1.5)
    ax.plot([6.5, 8.5], [1.1, 1.1], color=C_BORDER, lw=1.5)
    ax.text(7.5, 0.85, "D2: Cloud Firestore", ha='center', va='center', fontsize=8, fontweight='bold')

    # Arrows
    ax.annotate('', xy=(2.9, 2.4), xytext=(2.3, 2.4), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))
    ax.annotate('', xy=(5.3, 2.4), xytext=(4.7, 2.4), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))
    ax.annotate('', xy=(7.7, 2.4), xytext=(7.1, 2.4), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))

    ax.annotate('', xy=(2.0, 1.1), xytext=(1.4, 1.8), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.0))
    ax.annotate('', xy=(7.5, 1.8), xytext=(7.5, 1.1), arrowprops=dict(arrowstyle="<-", color=C_BORDER, lw=1.0))

    save_fig(fig, "fig4_dfd1.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 5: ACTIVITY DIAGRAM
# ═════════════════════════════════════════════════════════════════════════
def draw_fig5():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    # Start node
    c = plt.Circle((0.8, 2.25), 0.25, color=C_BORDER)
    ax.add_patch(c)

    steps = [
        ("1-Tap Distress\nTrigger", 1.5),
        ("Capture GPS\n& Calibration", 3.2),
        ("Fire Dual SOS\n(SMS + Email)", 4.9),
        ("Web Audio\nSiren (800Hz)", 6.6),
        ("Encrypt & Log\nSafety Event", 8.3),
    ]

    prev_x = 0.8
    for title, x in steps:
        r = patches.FancyBboxPatch((x, 1.7), 1.35, 1.1, boxstyle="round,pad=0.1",
                                   facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.2)
        ax.add_patch(r)
        ax.text(x + 0.675, 2.25, title, ha='center', va='center', fontsize=7.5, fontweight='bold')
        ax.annotate('', xy=(x, 2.25), xytext=(prev_x + (0.25 if prev_x == 0.8 else 1.35), 2.25),
                    arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))
        prev_x = x

    save_fig(fig, "fig5_activity.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 6: ENTITY RELATIONSHIP DIAGRAM
# ═════════════════════════════════════════════════════════════════════════
def draw_fig6():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    entities = [
        ("User Account", ["PK: uid", "name, email", "phone, role", "medicalNotes"], 0.6, 2.2),
        ("Emergency Contact", ["PK: contactId", "FK: userId", "name, phone", "priorityOrder"], 3.8, 2.2),
        ("Safety Event (SOS)", ["PK: eventId", "FK: userId", "lat, lng, acc", "smsDelivered"], 7.0, 2.2),
        ("Journey Session", ["PK: journeyId", "FK: userId", "targetEta, status", "graceExpired"], 3.8, 0.3),
    ]

    for title, fields, x, y in entities:
        r = patches.Rectangle((x, y), 2.4, 1.6, facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.2)
        ax.add_patch(r)
        ax.text(x + 1.2, y + 1.35, title, ha='center', va='center', fontsize=8.5, fontweight='bold')
        ax.plot([x, x + 2.4], [y + 1.15, y + 1.15], color=C_BORDER, lw=1.0)
        for idx, f in enumerate(fields):
            ax.text(x + 0.15, y + 0.95 - idx * 0.28, f, ha='left', va='center', fontsize=7.5)

    ax.annotate('1 : N', xy=(3.8, 3.0), xytext=(3.0, 3.0), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=8)
    ax.annotate('1 : N', xy=(7.0, 3.0), xytext=(6.2, 3.0), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=8)
    ax.annotate('1 : N', xy=(5.0, 1.9), xytext=(5.0, 2.2), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=8)

    save_fig(fig, "fig6_erd.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 7: CLASS DIAGRAM
# ═════════════════════════════════════════════════════════════════════════
def draw_fig7():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    classes = [
        ("UserProfile", ["+ uid: String", "+ name: String", "+ phone: String", "+ save(): Promise"], 0.5, 2.2),
        ("EmergencyContact", ["+ id: String", "+ phone: String", "+ email: String", "+ notify(): void"], 3.7, 2.2),
        ("SOSDispatcher", ["+ dispatchAll(): void", "+ sendSms(): bool", "+ sendEmail(): bool", "+ siren(): void"], 6.9, 2.2),
        ("JourneyEngine", ["+ eta: DateTime", "+ start(): void", "+ checkRollover(): void", "+ escalate(): void"], 3.7, 0.3),
    ]

    for title, methods, x, y in classes:
        r = patches.Rectangle((x, y), 2.5, 1.7, facecolor=C_BOX_BG, edgecolor=C_BORDER, linewidth=1.2)
        ax.add_patch(r)
        ax.text(x + 1.25, y + 1.45, title, ha='center', va='center', fontsize=8.5, fontweight='bold')
        ax.plot([x, x + 2.5], [y + 1.25, y + 1.25], color=C_BORDER, lw=1.0)
        for idx, m in enumerate(methods):
            ax.text(x + 0.15, y + 1.05 - idx * 0.28, m, ha='left', va='center', fontsize=7.5)

    ax.annotate('', xy=(3.7, 3.0), xytext=(3.0, 3.0), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))
    ax.annotate('', xy=(6.9, 3.0), xytext=(6.2, 3.0), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))
    ax.annotate('', xy=(5.0, 2.0), xytext=(5.0, 2.2), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))

    save_fig(fig, "fig7_class.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 8 & 9: SEQUENCE & COLLABORATION DIAGRAMS
# ═════════════════════════════════════════════════════════════════════════
def draw_fig8_9():
    # Sequence Diagram
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    lifelines = [("User", 1.0), ("PWA Client", 3.2), ("SmsManager", 5.4), ("Brevo API", 7.2), ("Guardians", 9.0)]
    for name, x in lifelines:
        r = patches.Rectangle((x - 0.7, 3.9), 1.4, 0.5, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
        ax.add_patch(r)
        ax.text(x, 4.15, name, ha='center', va='center', fontsize=8, fontweight='bold')
        ax.plot([x, x], [0.3, 3.9], color=C_BORDER, lw=1.0, ls='--')

    # Arrows
    arrows = [
        (1.0, 3.2, 3.5, "1: Trigger Panic (SOS)"),
        (3.2, 5.4, 2.9, "2: DirectSmsPlugin.send()"),
        (5.4, 9.0, 2.3, "3: Baseband GSM SMS Frame"),
        (3.2, 7.2, 1.7, "4: POST /v3/smtp/email"),
        (7.2, 9.0, 1.1, "5: Rich HTML Alert Email"),
    ]
    for x1, x2, y, txt in arrows:
        ax.annotate(txt, xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5, va='bottom')

    save_fig(fig, "fig8_sequence.png")

    # Collaboration Diagram
    fig2, ax2 = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax2.set_xlim(0, 10)
    ax2.set_ylim(0, 4.5)
    ax2.axis('off')
    fig2.patch.set_facecolor(C_BG)

    nodes = [
        ("Commuter (User)", 1.2, 2.2),
        ("SOS Dispatcher Core", 5.0, 2.2),
        ("Hardware GSM Radio", 8.2, 3.2),
        ("Brevo Email SMTP", 8.2, 1.2),
    ]
    for name, x, y in nodes:
        r = patches.FancyBboxPatch((x - 1.1, y - 0.45), 2.2, 0.9, boxstyle="square,pad=0.08",
                                   facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
        ax2.add_patch(r)
        ax2.text(x, y, name, ha='center', va='center', fontsize=8, fontweight='bold')

    ax2.annotate('1: 1-Tap Trigger', xy=(3.9, 2.2), xytext=(2.3, 2.2),
                 arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5, va='bottom')
    ax2.annotate('2: Send GSM Text', xy=(7.1, 3.2), xytext=(6.1, 2.6),
                 arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5)
    ax2.annotate('3: Post HTML Alert', xy=(7.1, 1.2), xytext=(6.1, 1.8),
                 arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=7.5)

    save_fig(fig2, "fig9_collab.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 10: USE CASE DIAGRAM
# ═════════════════════════════════════════════════════════════════════════
def draw_fig10():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    # Actor 1: Commuter
    ax.add_patch(patches.Circle((1.0, 2.8), 0.35, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2))
    ax.plot([1.0, 1.0], [2.45, 1.8], color=C_BORDER, lw=1.5)
    ax.plot([0.5, 1.5], [2.2, 2.2], color=C_BORDER, lw=1.5)
    ax.plot([1.0, 0.6], [1.8, 1.3], color=C_BORDER, lw=1.5)
    ax.plot([1.0, 1.4], [1.8, 1.3], color=C_BORDER, lw=1.5)
    ax.text(1.0, 0.9, "Commuter User\n(Mobile App)", ha='center', fontsize=8, fontweight='bold')

    # Actor 2: Guardian
    ax.add_patch(patches.Circle((9.0, 2.8), 0.35, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2))
    ax.plot([9.0, 9.0], [2.45, 1.8], color=C_BORDER, lw=1.5)
    ax.plot([8.5, 9.5], [2.2, 2.2], color=C_BORDER, lw=1.5)
    ax.plot([9.0, 8.6], [1.8, 1.3], color=C_BORDER, lw=1.5)
    ax.plot([9.0, 9.4], [1.8, 1.3], color=C_BORDER, lw=1.5)
    ax.text(9.0, 0.9, "Trusted Guardians\n& Responders", ha='center', fontsize=8, fontweight='bold')

    use_cases = [
        ("Trigger 1-Tap Emergency SOS", 3.8),
        ("Calibrate GPS Pin on Map", 3.0),
        ("Set Trusted Journey & ETA", 2.2),
        ("Locate Nearby Police / Hospitals", 1.4),
        ("Record Camera / Siren Evidence", 0.6),
    ]
    for uc, y in use_cases:
        ellipse = patches.Ellipse((5.0, y), 3.4, 0.6, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
        ax.add_patch(ellipse)
        ax.text(5.0, y, uc, ha='center', va='center', fontsize=8)
        ax.plot([1.6, 3.3], [2.4, y], color=C_BORDER, lw=0.9)
        if y in [3.8, 2.2]:
            ax.plot([6.7, 8.4], [y, 2.4], color=C_BORDER, lw=0.9)

    save_fig(fig, "fig10_usecase.png")

# ═════════════════════════════════════════════════════════════════════════
# FIG 11, 12, 13: WORKFLOW, ESCALATION GATE & PAYLOAD ARCHITECTURE
# ═════════════════════════════════════════════════════════════════════════
def draw_fig11_12_13():
    # Fig 11: End-to-End Workflow
    fig, ax = plt.subplots(figsize=(10, 2.8), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 2.8)
    ax.axis('off')
    fig.patch.set_facecolor(C_BG)

    stages = [
        ("1. Telemetry\nGPS Lock", 0.3),
        ("2. Geodesic\nRadar Ring", 2.3),
        ("3. 1-Tap SOS\nActivation", 4.3),
        ("4. Dual Fan-Out\n(SMS + Email)", 6.3),
        ("5. Civic Refuge\nNavigation", 8.3),
    ]
    for idx, (st, x) in enumerate(stages):
        r = patches.FancyBboxPatch((x, 0.8), 1.5, 1.2, boxstyle="square,pad=0.08",
                                   facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
        ax.add_patch(r)
        ax.text(x + 0.75, 1.4, st, ha='center', va='center', fontsize=7.5, fontweight='bold')
        if idx < 4:
            ax.annotate('', xy=(x + 2.3, 1.4), xytext=(x + 1.5, 1.4),
                        arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))

    save_fig(fig, "fig11_workflow.png")

    # Fig 12: Escalation Gate
    fig2, ax2 = plt.subplots(figsize=(10, 3.8), dpi=300)
    ax2.set_xlim(0, 10)
    ax2.set_ylim(0, 3.8)
    ax2.axis('off')
    fig2.patch.set_facecolor(C_BG)

    r_start = patches.Rectangle((3.5, 2.8), 3.0, 0.8, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
    ax2.add_patch(r_start)
    ax2.text(5.0, 3.2, "Journey Countdown (ETA)\nExpires (T + 00:00)", ha='center', va='center', fontsize=8, fontweight='bold')

    diamond = patches.Polygon([[5.0, 2.3], [6.2, 1.7], [5.0, 1.1], [3.8, 1.7]],
                              facecolor='#FFFFFF', edgecolor=C_BORDER, lw=1.2)
    ax2.add_patch(diamond)
    ax2.text(5.0, 1.7, "User PIN\nCancelled in 60s?", ha='center', va='center', fontsize=7.5)

    ax2.annotate('', xy=(5.0, 2.3), xytext=(5.0, 2.8), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2))

    # Yes -> Terminate Safe
    r_safe = patches.Rectangle((7.5, 1.3), 2.0, 0.8, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
    ax2.add_patch(r_safe)
    ax2.text(8.5, 1.7, "Arrived Safe\n(Reset State)", ha='center', va='center', fontsize=8, fontweight='bold')
    ax2.annotate('YES', xy=(7.5, 1.7), xytext=(6.2, 1.7), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=8)

    # No -> Escalate SOS
    r_sos = patches.Rectangle((0.5, 1.3), 2.2, 0.8, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
    ax2.add_patch(r_sos)
    ax2.text(1.6, 1.7, "Auto-Escalate SOS\n(SMS + Email + Siren)", ha='center', va='center', fontsize=8, fontweight='bold')
    ax2.annotate('NO', xy=(2.7, 1.7), xytext=(3.8, 1.7), arrowprops=dict(arrowstyle="->", color=C_BORDER, lw=1.2), fontsize=8)

    save_fig(fig2, "fig12_approval.png")

    # Fig 13: Payload Structure
    fig3, ax3 = plt.subplots(figsize=(10, 3.8), dpi=300)
    ax3.set_xlim(0, 10)
    ax3.set_ylim(0, 3.8)
    ax3.axis('off')
    fig3.patch.set_facecolor(C_BG)

    r_struct = patches.Rectangle((1.5, 0.4), 7.0, 3.0, facecolor=C_BOX_BG, edgecolor=C_BORDER, lw=1.2)
    ax3.add_patch(r_struct)
    ax3.text(5.0, 3.05, "SecureHer Emergency Dispatch Payload Architecture", ha='center', va='center', fontsize=9, fontweight='bold')
    ax3.plot([1.5, 8.5], [2.8, 2.8], color=C_BORDER, lw=1.0)

    p_items = [
        ("WGS 84 Coordinates: latitude, longitude, altitude", 2.45),
        ("Accuracy Radius: geodesic confidence radius (meters)", 2.05),
        ("Situation Telemetry: timestamp, battery %, network carrier mode", 1.65),
        ("Interactive Hyperlink: direct Google Maps turn-by-turn routing URL", 1.25),
        ("Cryptographic Watermark: SHA-256 integrity hash & evidence ref", 0.85),
    ]
    for it, y in p_items:
        ax3.text(1.8, y, f"• {it}", ha='left', va='center', fontsize=8)

    save_fig(fig3, "fig13_structure.png")

if __name__ == "__main__":
    print("Generating all 13 University-format diagrams...")
    draw_fig2()
    draw_fig3()
    draw_fig4()
    draw_fig5()
    draw_fig6()
    draw_fig7()
    draw_fig8_9()
    draw_fig10()
    draw_fig11_12_13()
    print("All 13 diagrams generated successfully!")
