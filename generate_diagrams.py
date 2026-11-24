import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_system_architecture(output_path='public/assets/architecture_diagram.png'):
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # Color palette
    c_bg = '#FDFBFC'
    c_primary = '#5B214F'
    c_secondary = '#C75B7A'
    c_accent = '#D92D3A'
    c_card = '#FFFFFF'
    c_border = '#E6C8D5'
    c_text = '#2A1824'
    c_sub = '#6B4C60'

    fig.patch.set_facecolor(c_bg)

    # Title
    ax.text(7, 8.55, "SECUREHER: MULTI-TIER REACTIVE SYSTEM ARCHITECTURE", 
            ha='center', va='center', fontsize=18, fontweight='bold', color=c_primary, fontfamily='sans-serif')
    ax.text(7, 8.2, "Decoupled 5-Tier Emergency Telematics & Cloud Orchestration Architecture", 
            ha='center', va='center', fontsize=11, color=c_secondary, fontfamily='sans-serif')

    tiers = [
        ("TIER 1: PRESENTATION & PWA LAYER", 
         ["React 18.3 (Single Page Application)", "Vite 5.4 High-Speed Bundler", "Progressive Web App (PWA) Cache", "Touch-Optimized UI & WCAG 2.1 AAA"],
         7.1, '#5B214F'),
        ("TIER 2: NATIVE HARDWARE TELEPHONY BRIDGE", 
         ["Capacitor 6.0 Mobile Native Runtime", "DirectSmsPlugin.java (Android JNI)", "Android SmsManager (Circuit-Switched GSM)", "Hardware Baseband Queue (Zero Data)"],
         5.6, '#8E285F'),
        ("TIER 3: CLIENT STATE & EDGE ENGINES", 
         ["MapLibre GL 4.7 GPU Vector Engine", "Dynamic Missing Sprite Resolver", "Geodesic Accuracy Circle (WGS 84)", "Web Audio API Deterrent Siren (800-1600Hz)"],
         4.1, '#C75B7A'),
        ("TIER 4: CLOUD SERVICES & SECURITY GATEWAY", 
         ["Firebase Auth (Bearer JWT Tokens)", "Cloud Firestore (Isolated /users/{uid})", "FastAPI Python Microservice (Async)", "Firebase Cloud Messaging (FCM Push)"],
         2.6, '#A33B65'),
        ("TIER 5: EXTERNAL INFRASTRUCTURE & DISPATCH", 
         ["Brevo v3 Transactional SMTP/REST API", "OpenStreetMap Overpass Spatial API", "Nominatim Reverse Geocoding Service", "Google Maps Turn-by-Turn Navigation"],
         1.1, '#D92D3A'),
    ]

    for title, items, y_pos, color in tiers:
        # Tier boundary card
        rect = patches.FancyBboxPatch((0.8, y_pos - 0.55), 12.4, 1.15,
                                      boxstyle="round,pad=0.08,rounding_size=0.15",
                                      facecolor=c_card, edgecolor=color, linewidth=2.0, zorder=2)
        ax.add_patch(rect)
        
        # Tag pill on left
        tag_rect = patches.FancyBboxPatch((0.95, y_pos - 0.42), 3.4, 0.9,
                                          boxstyle="round,pad=0.05,rounding_size=0.12",
                                          facecolor=color, edgecolor='none', zorder=3)
        ax.add_patch(tag_rect)
        ax.text(2.65, y_pos + 0.03, title.split(":")[0], ha='center', va='center', 
                color='#FFFFFF', fontsize=9.5, fontweight='bold', fontfamily='sans-serif', zorder=4)
        ax.text(2.65, y_pos - 0.22, title.split(":")[1].strip(), ha='center', va='center', 
                color='#FFE6F0', fontsize=8, fontweight='semibold', fontfamily='sans-serif', zorder=4)

        # 4 Component boxes inside each tier
        box_w = 2.05
        spacing = 0.12
        start_x = 4.55
        for i, item in enumerate(items):
            bx = start_x + i * (box_w + spacing)
            item_rect = patches.FancyBboxPatch((bx, y_pos - 0.45), box_w, 0.95,
                                               boxstyle="round,pad=0.04,rounding_size=0.08",
                                               facecolor='#FAF5F8', edgecolor=c_border, linewidth=1.0, zorder=3)
            ax.add_patch(item_rect)
            
            # Text wrapped into item
            words = item.split()
            mid = len(words) // 2
            line1 = " ".join(words[:mid]) if mid > 0 else words[0]
            line2 = " ".join(words[mid:]) if mid > 0 else ""
            ax.text(bx + box_w/2, y_pos + 0.1, line1, ha='center', va='center', 
                    color=c_text, fontsize=8.5, fontweight='bold', fontfamily='sans-serif', zorder=4)
            if line2:
                ax.text(bx + box_w/2, y_pos - 0.18, line2, ha='center', va='center', 
                        color=c_sub, fontsize=7.5, fontfamily='sans-serif', zorder=4)

        # Connection arrow down
        if y_pos > 1.5:
            ax.annotate('', xy=(7, y_pos - 0.58), xytext=(7, y_pos - 0.54),
                        arrowprops=dict(arrowstyle="->", color=color, lw=2.2, mutation_scale=14), zorder=5)

    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"Architecture diagram generated: {output_path}")

def draw_system_structure(output_path='public/assets/structure_diagram.png'):
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    c_bg = '#FDFBFC'
    c_primary = '#5B214F'
    c_secondary = '#C75B7A'
    c_accent = '#D92D3A'
    c_green = '#2E7D32'
    c_blue = '#1E88E5'

    fig.patch.set_facecolor(c_bg)

    ax.text(7, 8.55, "SECUREHER: SYSTEM STRUCTURE & EMERGENCY DATA FLOW", 
            ha='center', va='center', fontsize=18, fontweight='bold', color=c_primary, fontfamily='sans-serif')
    ax.text(7, 8.2, "Dual-Channel Alert Fan-Out, GNSS Satellite Pipeline & Civic Infrastructure Locator", 
            ha='center', va='center', fontsize=11, color=c_secondary, fontfamily='sans-serif')

    # Central Core Node: SecureHer Security Engine
    core_box = patches.FancyBboxPatch((5.0, 4.2), 4.0, 2.5,
                                      boxstyle="round,pad=0.1,rounding_size=0.2",
                                      facecolor='#5B214F', edgecolor='#D92D3A', linewidth=2.5, zorder=3)
    ax.add_patch(core_box)
    ax.text(7.0, 5.9, "SECUREHER CORE", ha='center', va='center', color='#FFFFFF', fontsize=14, fontweight='bold')
    ax.text(7.0, 5.5, "Reactive Safety State Machine", ha='center', va='center', color='#FFDDE8', fontsize=10)
    ax.text(7.0, 5.1, "• Sub-20m GNSS Convergence", ha='center', va='center', color='#FFFFFF', fontsize=8.5)
    ax.text(7.0, 4.75, "• Asynchronous Fan-Out Engine", ha='center', va='center', color='#FFFFFF', fontsize=8.5)
    ax.text(7.0, 4.4, "• Overnight Rollover Countdown", ha='center', va='center', color='#FFFFFF', fontsize=8.5)

    # Left Node: Commuter Input / Trigger
    user_box = patches.FancyBboxPatch((0.8, 4.5), 3.2, 2.0,
                                      boxstyle="round,pad=0.08,rounding_size=0.15",
                                      facecolor='#FFFFFF', edgecolor='#C75B7A', linewidth=2.0, zorder=3)
    ax.add_patch(user_box)
    ax.text(2.4, 5.9, "COMMUTER TOUCHPOINT", ha='center', va='center', color='#5B214F', fontsize=11, fontweight='bold')
    ax.text(2.4, 5.45, "• 1-Tap SOS Activation (<500ms)\n• Trusted Journey Setup (ETA)\n• Interactive Draggable Pin\n• 800-1600Hz Acoustic Siren", 
            ha='center', va='center', color='#4A3241', fontsize=8.2, linespacing=1.4)

    # Arrow from User to Core
    ax.annotate('', xy=(5.0, 5.45), xytext=(4.0, 5.45),
                arrowprops=dict(arrowstyle="->", color='#5B214F', lw=2.5, mutation_scale=16), zorder=4)
    ax.text(4.5, 5.7, "Distress Trigger", ha='center', va='center', color='#D92D3A', fontsize=8, fontweight='bold')

    # Top Node: Telemetry & Satellite GPS
    gps_box = patches.FancyBboxPatch((5.0, 7.0), 4.0, 0.95,
                                     boxstyle="round,pad=0.06,rounding_size=0.12",
                                     facecolor='#FFFFFF', edgecolor=c_blue, linewidth=1.8, zorder=3)
    ax.add_patch(gps_box)
    ax.text(7.0, 7.6, "SATELLITE GNSS & MAPLIBRE ENGINE", ha='center', va='center', color=c_blue, fontsize=10, fontweight='bold')
    ax.text(7.0, 7.25, "HTML5 watchPosition (±5m Satellite Lock) + Geodesic Circles", ha='center', va='center', color='#333333', fontsize=8)

    ax.annotate('', xy=(7.0, 6.7), xytext=(7.0, 7.0),
                arrowprops=dict(arrowstyle="->", color=c_blue, lw=2.2, mutation_scale=14), zorder=4)

    # Right Nodes: 3 Outbound Emergency Channels
    # Channel 1: Hardware SMS (Top Right)
    sms_box = patches.FancyBboxPatch((9.8, 5.8), 3.4, 1.4,
                                     boxstyle="round,pad=0.06,rounding_size=0.12",
                                     facecolor='#FFFFFF', edgecolor=c_accent, linewidth=2.0, zorder=3)
    ax.add_patch(sms_box)
    ax.text(11.5, 6.75, "CHANNEL 1: HARDWARE SMS", ha='center', va='center', color=c_accent, fontsize=10, fontweight='bold')
    ax.text(11.5, 6.35, "Direct Android SmsManager (GSM)\nOperates in Zero Mobile Data", ha='center', va='center', color='#333333', fontsize=8, linespacing=1.3)
    ax.text(11.5, 5.95, "Deliver: Trusted Contacts Phones", ha='center', va='center', color=c_accent, fontsize=8, fontweight='semibold')

    ax.annotate('', xy=(9.8, 6.5), xytext=(9.0, 5.8),
                arrowprops=dict(arrowstyle="->", color=c_accent, lw=2.0, mutation_scale=14), zorder=4)

    # Channel 2: Brevo Email (Middle Right)
    email_box = patches.FancyBboxPatch((9.8, 4.1), 3.4, 1.4,
                                       boxstyle="round,pad=0.06,rounding_size=0.12",
                                       facecolor='#FFFFFF', edgecolor='#C75B7A', linewidth=2.0, zorder=3)
    ax.add_patch(email_box)
    ax.text(11.5, 5.05, "CHANNEL 2: BREVO EMAIL", ha='center', va='center', color='#5B214F', fontsize=10, fontweight='bold')
    ax.text(11.5, 4.65, "FastAPI + Direct Brevo REST API v3\nStyled HTML Alert Card + Map Link", ha='center', va='center', color='#333333', fontsize=8, linespacing=1.3)
    ax.text(11.5, 4.25, "Deliver: Contact Inboxes Worldwide", ha='center', va='center', color='#C75B7A', fontsize=8, fontweight='semibold')

    ax.annotate('', xy=(9.8, 4.8), xytext=(9.0, 5.1),
                arrowprops=dict(arrowstyle="->", color='#5B214F', lw=2.0, mutation_scale=14), zorder=4)

    # Channel 3: Cloud FCM Push & Audit (Bottom Right)
    cloud_box = patches.FancyBboxPatch((9.8, 2.4), 3.4, 1.4,
                                       boxstyle="round,pad=0.06,rounding_size=0.12",
                                       facecolor='#FFFFFF', edgecolor=c_green, linewidth=2.0, zorder=3)
    ax.add_patch(cloud_box)
    ax.text(11.5, 3.35, "CHANNEL 3: FCM & CLOUD AUDIT", ha='center', va='center', color=c_green, fontsize=10, fontweight='bold')
    ax.text(11.5, 2.95, "Firebase Cloud Messaging Push\nImmutable Firestore Safety Event", ha='center', va='center', color='#333333', fontsize=8, linespacing=1.3)
    ax.text(11.5, 2.55, "Deliver: Paired Guardian Devices", ha='center', va='center', color=c_green, fontsize=8, fontweight='semibold')

    ax.annotate('', xy=(9.8, 3.1), xytext=(9.0, 4.5),
                arrowprops=dict(arrowstyle="->", color=c_green, lw=2.0, mutation_scale=14), zorder=4)

    # Bottom Node: Civic Services Discovery (Overpass OSM API)
    civic_box = patches.FancyBboxPatch((2.5, 0.8), 9.0, 1.15,
                                       boxstyle="round,pad=0.06,rounding_size=0.12",
                                       facecolor='#FFFFFF', edgecolor='#5B214F', linewidth=1.8, zorder=3)
    ax.add_patch(civic_box)
    ax.text(7.0, 1.6, "CIVIC EMERGENCY INFRASTRUCTURE DISCOVERY (OVERPASS OSM API)", ha='center', va='center', color='#5B214F', fontsize=10, fontweight='bold')
    ax.text(7.0, 1.15, "• Police Stations (112) • Emergency Hospitals & Trauma (102/108) • 10km Quick Radius Filter • Direct 1-Tap Google Navigation", 
            ha='center', va='center', color='#4A3241', fontsize=8.5)

    ax.annotate('', xy=(7.0, 1.95), xytext=(7.0, 4.2),
                arrowprops=dict(arrowstyle="<->", color='#5B214F', lw=1.8, mutation_scale=14), zorder=4)

    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"Structure diagram generated: {output_path}")

if __name__ == '__main__':
    draw_system_architecture('public/assets/architecture_diagram.png')
    draw_system_architecture('Project_Reports/architecture_diagram.png')
    draw_system_structure('public/assets/structure_diagram.png')
    draw_system_structure('Project_Reports/structure_diagram.png')
