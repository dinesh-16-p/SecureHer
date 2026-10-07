/**
 * SecureHer AI Service Client
 * Routes user queries through the hybrid backend /api/ai endpoint
 * (Controlled SecureHer logic + Gemini API fallback)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const queryAI = async (prompt, userContext = {}) => {
  if (!prompt || !prompt.trim()) {
    return { reply: 'Please enter a question or query.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ prompt, userContext }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        reply: data.reply || 'No response returned.',
        source: data.source || 'ai'
      };
    } else {
      // Controlled client-side fallback if backend AI is unavailable
      return getClientControlledFallback(prompt, userContext);
    }
  } catch (err) {
    return getClientControlledFallback(prompt, userContext);
  }
};

const getClientControlledFallback = (prompt, userContext) => {
  const p = prompt.toLowerCase();

  if (p.includes('sos') || p.includes('danger') || p.includes('help') || p.includes('emergency')) {
    return {
      source: 'client_fallback',
      reply: '🚨 **IMMEDIATE EMERGENCY GUIDANCE:** If you feel unsafe or threatened, press the **Emergency SOS button** in SecureHer or call national emergency services at **112** (or Women Helpline **1091**). Head immediately to a safe, populated area.'
    };
  }

  if (p.includes('period') || p.includes('cycle') || p.includes('ovulation')) {
    return {
      source: 'client_fallback',
      reply: '🌸 **Cycle Support:** Go to **Health → Period Tracker** to log your period start date and calculate your dynamic cycle phase and ovulation window.'
    };
  }

  if (p.includes('contact') || p.includes('add')) {
    return {
      source: 'client_fallback',
      reply: '👥 **Emergency Contacts:** Navigate to **Safety → Emergency Contacts** to configure trusted contacts who will receive automatic SOS emails with your live coordinates.'
    };
  }

  return {
    source: 'client_fallback',
    reply: 'I am your SecureHer Safety & Health Assistant. For immediate emergencies, use **Emergency SOS** or dial **112**. Navigate to Safety, Health, or Community using the menu.'
  };
};
