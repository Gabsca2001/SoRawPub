import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Definiamo il tipo di dati che ci aspettiamo dal Frontend
interface EmailPayload {
  email: string;
  name: string;
  date: string;
  time: string;
  guests: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export async function POST(request: Request) {
  try {
    // --- DEBUG LOGS (Verifica variabili d'ambiente) ---
    console.log("Tentativo invio email in corso...");

    // 1. Leggi i dati dal corpo della richiesta
    const body: EmailPayload = await request.json();
    const { email, name, date, time, guests, status } = body;

    // 2. Controllo di sicurezza: Variabili d'ambiente
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("ERRORE CRITICO: Variabili d'ambiente mancanti.");
      return NextResponse.json({ error: 'Configurazione server incompleta (Mancano credenziali)' }, { status: 500 });
    }

    // 3. Configura il trasportatore per ARUBA (SMTPS)
    const transporter = nodemailer.createTransport({
      host: "smtps.aruba.it", 
      port: 465,            // Porta SSL sicura standard per Aruba
      secure: true,         // Usa SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Prepara il contenuto dell'email in base allo stato
    let subject = '';
    let htmlContent = '';
    
    // Stile base per le email (CSS inline per compatibilità)
    const baseStyle = "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6;";
    const containerStyle = "max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;";
    
    if (status === 'confirmed') {
      subject = '✅ Prenotazione Confermata - Soraw Cocktail Bar';
      htmlContent = `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <h2 style="color: #4caf50; text-align: center;">Prenotazione Confermata!</h2>
            <p>Ciao <strong>${name}</strong>,</p>
            <p>Siamo felici di confermarti che il tuo tavolo è stato riservato.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;">📅 <strong>Data:</strong> ${date}</p>
              <p style="margin: 5px 0;">⏰ <strong>Ora:</strong> ${time}</p>
              <p style="margin: 5px 0;">👥 <strong>Ospiti:</strong> ${guests}</p>
            </div>

            <p>Ti aspettiamo per il tuo racconto liquido.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #777; text-align: center;">
              Soraw Cocktail Bar<br>
              <a href="https://www.sorawcocktail.it" style="color: #777;">www.sorawcocktail.it</a>
            </p>
          </div>
        </div>
      `;
    } 
    else if (status === 'cancelled') {
      subject = '⚠️ Aggiornamento Prenotazione - Soraw Cocktail Bar';
      htmlContent = `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <h2 style="color: #f44336; text-align: center;">Prenotazione Cancellata</h2>
            <p>Ciao <strong>${name}</strong>,</p>
            <p>Ci dispiace informarti che non è stato possibile confermare la tua prenotazione per il giorno <strong>${date}</strong> alle ore <strong>${time}</strong>.</p>
            
            <p>Questo può accadere se siamo al completo o se c'è stato un imprevisto tecnico.</p>
            
            <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="margin: 0;">📞 Ti invitiamo a contattarci telefonicamente o su WhatsApp per verificare altre disponibilità.</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
             <p style="font-size: 0.8em; color: #777; text-align: center;">
              Soraw Cocktail Bar<br>
              <a href="https://www.sorawcocktail.it" style="color: #777;">www.sorawcocktail.it</a>
            </p>
          </div>
        </div>
      `;
    } 
    else {
      // Se lo stato è 'pending' o altro, non inviamo nulla ed usciamo
      return NextResponse.json({ message: 'Nessuna email necessaria per questo stato' });
    }

    // 5. Invia l'email
    await transporter.sendMail({
      from: `"Soraw Cocktail Bar" <${process.env.EMAIL_USER}>`, // Mittente
      to: email, // Destinatario
      subject: subject,
      html: htmlContent,
    });

    console.log(`Email inviata a ${email} con stato: ${status}`);
    return NextResponse.json({ success: true, message: 'Email inviata con successo' });

  } catch (error: any) {
    console.error('ERRORE INVIO EMAIL:', error);
    // Log più dettagliato per capire cosa non va
    return NextResponse.json(
      { error: 'Errore durante l\'invio dell\'email', details: error.message }, 
      { status: 500 }
    );
  }
}