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

// --- FUNZIONE NOTIFICA TELEGRAM ---
async function sendTelegramNotification(name: string, date: string, time: string, guests: string | number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram non configurato: mancano le variabili d'ambiente.");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const message = `
🔔 <b>NUOVA RICHIESTA TAVOLO!</b>

👤 <b>Nome:</b> ${name}
👥 <b>Ospiti:</b> ${guests}
📅 <b>Quando:</b> ${date} alle ${time}

🔒 <i>Dati di contatto protetti.</i>
👉 <a href="https://sorawcocktailbar.it/wp-admin-login-so-raw">CLICCA QUI PER GESTIRE</a>
  `;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      }),
    });
    console.log("Notifica Telegram inviata.");
  } catch (error) {
    console.error("Errore invio notifica Telegram:", error);
  }
}

export async function POST(request: Request) {
  try {
    const body: EmailPayload = await request.json();
    const { email, name, date, time, guests, status } = body;

    // --- CASO 1: NUOVA PRENOTAZIONE DAL SITO (Pending) ---
    // Se lo stato è 'pending', significa che arriva dal Form del sito.
    // In questo caso, DOBBIAMO avvisare il proprietario su Telegram.
    if (status === 'pending') {
      // Invio Telegram (non bloccante)
      sendTelegramNotification(name, date, time, guests);
      
      // Opzionale: Se vuoi mandare anche una mail di "Ricevuta richiesta" al cliente, fallo qui.
      // Per ora, ritorniamo successo perché la notifica al proprietario è partita.
      return NextResponse.json({ success: true, message: 'Notifica Telegram inviata' });
    }

    // --- CASO 2: GESTIONE ADMIN (Confirmed / Cancelled) ---
    // Se siamo qui, lo stato NON è pending, quindi stiamo confermando o cancellando.
    // Dobbiamo mandare l'email al cliente.

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Configurazione email server incompleta' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtps.aruba.it",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject = '';
    let htmlContent = '';
    const baseStyle = "font-family: sans-serif; color: #333; line-height: 1.6;";
    const containerStyle = "max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;";

    if (status === 'confirmed') {
      subject = '✅ Prenotazione Confermata - Soraw Cocktail Bar';
      htmlContent = `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <h2 style="color: #4caf50;">Prenotazione Confermata!</h2>
            <p>Ciao <strong>${name}</strong>, il tuo tavolo è confermato.</p>
            <p>📅 ${date} | ⏰ ${time} | 👥 ${guests} px</p>
            <p>Ti aspettiamo!</p>
          </div>
        </div>`;
    } 
    else if (status === 'cancelled') {
      subject = '⚠️ Aggiornamento Prenotazione - Soraw Cocktail Bar';
      htmlContent = `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <h2 style="color: #f44336;">Prenotazione Cancellata</h2>
            <p>Ciao <strong>${name}</strong>, ci dispiace ma non possiamo confermare la tua richiesta.</p>
            <p>Contattaci per trovare un'alternativa.</p>
          </div>
        </div>`;
    }

    // Invio effettivo email
    await transporter.sendMail({
      from: `"Soraw Cocktail Bar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email inviata con successo' });

  } catch (error: any) {
    console.error('ERRORE API:', error);
    return NextResponse.json({ error: 'Errore server', details: error.message }, { status: 500 });
  }
}