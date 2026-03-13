import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Tipo dati atteso
interface EmailPayload {
  email: string;
  name: string;
  date: string;
  time: string;
  guests: string | number;
  status: 'confirmed' | 'cancelled' | 'pending';
}

// Escape base per evitare problemi con caratteri speciali in HTML Telegram
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- FUNZIONE NOTIFICA TELEGRAM ---
async function sendTelegramNotification(
  name: string,
  date: string,
  time: string,
  guests: string | number
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error(
      'Telegram non configurato: mancano TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID'
    );
  }

  const safeName = escapeHtml(String(name));
  const safeDate = escapeHtml(String(date));
  const safeTime = escapeHtml(String(time));
  const safeGuests = escapeHtml(String(guests));

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const message = `
🔔 <b>NUOVA RICHIESTA TAVOLO!</b>

👤 <b>Nome:</b> ${safeName}
👥 <b>Ospiti:</b> ${safeGuests}
📅 <b>Quando:</b> ${safeDate} alle ${safeTime}

🔒 <i>Dati di contatto protetti.</i>
👉 <a href="https://sorawcocktailbar.it/wp-admin-login-so-raw">CLICCA QUI PER GESTIRE</a>
  `.trim();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`Errore Telegram: ${data.description || 'invio fallito'}`);
  }

  console.log('Notifica Telegram inviata con successo');
}

export async function POST(request: Request) {
  try {
    const body: EmailPayload = await request.json();
    const { email, name, date, time, guests, status } = body;

    if (!name || !date || !time || guests === undefined || !status) {
      return NextResponse.json(
        { error: 'Dati mancanti nella richiesta' },
        { status: 400 }
      );
    }

    // --- CASO 1: NUOVA PRENOTAZIONE DAL SITO (Pending) ---
    if (status === 'pending') {
      await sendTelegramNotification(name, date, time, guests);

      return NextResponse.json({
        success: true,
        message: 'Notifica Telegram inviata con successo',
      });
    }

    // --- CASO 2: GESTIONE ADMIN (Confirmed / Cancelled) ---
    if (!email) {
      return NextResponse.json(
        { error: 'Email cliente mancante' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'Configurazione email server incompleta' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtps.aruba.it',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject = '';
    let htmlContent = '';

    const baseStyle = 'font-family: Arial, sans-serif; color: #333; line-height: 1.6;';
    const containerStyle =
      'max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 10px; background: #fff;';
    const infoBoxStyle =
      'margin: 20px 0; padding: 16px; background: #f8f8f8; border-radius: 8px;';

    if (status === 'confirmed') {
      subject = '✅ Prenotazione Confermata - Soraw Cocktail Bar';
      htmlContent = `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <h2 style="color: #4caf50; margin-top: 0;">Prenotazione Confermata</h2>
            <p>Ciao <strong>${name}</strong>,</p>
            <p>siamo felici di confermarti la tua prenotazione presso <strong>Soraw Cocktail Bar</strong>.</p>

            <div style="${infoBoxStyle}">
              <p style="margin: 0 0 8px 0;"><strong>📅 Data:</strong> ${date}</p>
              <p style="margin: 0 0 8px 0;"><strong>⏰ Orario:</strong> ${time}</p>
              <p style="margin: 0;"><strong>👥 Ospiti:</strong> ${guests}</p>
            </div>

            <p>Ti aspettiamo e ti ringraziamo per averci scelto.</p>
            <p>A presto,<br /><strong>Soraw Cocktail Bar</strong></p>
          </div>
        </div>
      `;
    } else if (status === 'cancelled') {
      subject = '⚠️ Aggiornamento Prenotazione - Soraw Cocktail Bar';
      htmlContent = `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <h2 style="color: #f44336; margin-top: 0;">Prenotazione non confermata</h2>
            <p>Ciao <strong>${name}</strong>,</p>
            <p>ci dispiace, ma al momento non possiamo confermare la tua richiesta di prenotazione.</p>

            <div style="${infoBoxStyle}">
              <p style="margin: 0 0 8px 0;"><strong>📅 Data richiesta:</strong> ${date}</p>
              <p style="margin: 0 0 8px 0;"><strong>⏰ Orario richiesto:</strong> ${time}</p>
              <p style="margin: 0;"><strong>👥 Ospiti:</strong> ${guests}</p>
            </div>

            <p>Per eventuali alternative o nuove disponibilità, ti invitiamo a ricontattarci.</p>
            <p>Un saluto,<br /><strong>Soraw Cocktail Bar</strong></p>
          </div>
        </div>
      `;
    } else {
      return NextResponse.json(
        { error: 'Stato non valido' },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"Soraw Cocktail Bar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Email inviata con successo',
    });
  } catch (error: any) {
    console.error('ERRORE API:', error);

    return NextResponse.json(
      {
        error: 'Errore server',
        details: error?.message || 'Errore sconosciuto',
      },
      { status: 500 }
    );
  }
}