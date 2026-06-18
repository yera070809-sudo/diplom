import nodemailer from 'nodemailer';

// Конфигурация SMTP (для разработки используем ethereal или console log)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface BookingEmailData {
  guestEmail: string;
  guestName: string;
  roomName: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  bookingId: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const { guestEmail, guestName, roomName, roomNumber, checkIn, checkOut, totalPrice, bookingId } = data;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const mailOptions = {
    from: '"Almaty Grand Hotel" <noreply@almatygrand.kz>',
    to: guestEmail,
    subject: `Подтверждение бронирования #${bookingId.slice(-8).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 24px; font-weight: bold; color: #1e293b; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Almaty Grand Hotel</h1>
            <p>Подтверждение бронирования</p>
          </div>
          <div class="content">
            <p>Уважаемый(ая) <strong>${guestName}</strong>,</p>
            <p>Благодарим вас за бронирование в Almaty Grand Hotel!</p>
            
            <div class="booking-details">
              <h3>Детали бронирования:</h3>
              <div class="detail-row">
                <span>Номер бронирования:</span>
                <strong>#${bookingId.slice(-8).toUpperCase()}</strong>
              </div>
              <div class="detail-row">
                <span>Категория номера:</span>
                <strong>${roomName}</strong>
              </div>
              <div class="detail-row">
                <span>Номер комнаты:</span>
                <strong>${roomNumber}</strong>
              </div>
              <div class="detail-row">
                <span>Дата заезда:</span>
                <strong>${formatDate(checkIn)}</strong>
              </div>
              <div class="detail-row">
                <span>Дата выезда:</span>
                <strong>${formatDate(checkOut)}</strong>
              </div>
              <div class="detail-row">
                <span>Итоговая стоимость:</span>
                <span class="total">${totalPrice.toLocaleString('ru-KZ')} ₸</span>
              </div>
            </div>
            
            <h3>Информация об отеле:</h3>
            <p>
              <strong>Адрес:</strong> г. Алматы, ул. Достык, 85<br>
              <strong>Телефон:</strong> +7 (727) 123-45-67<br>
              <strong>Email:</strong> info@almatygrand.kz
            </p>
            
            <p><strong>Время заезда:</strong> с 14:00<br>
            <strong>Время выезда:</strong> до 12:00</p>
          </div>
          <div class="footer">
            <p>Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
            <p>© ${new Date().getFullYear()} Almaty Grand Hotel. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // В режиме разработки логируем вместо отправки
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    console.log('📧 Email notification (dev mode):');
    console.log('To:', guestEmail);
    console.log('Subject:', mailOptions.subject);
    console.log('Booking ID:', bookingId);
    return { success: true, messageId: 'dev-' + Date.now() };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendBookingCancellation(data: Omit<BookingEmailData, 'totalPrice'>) {
  const { guestEmail, guestName, roomName, checkIn, checkOut, bookingId } = data;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const mailOptions = {
    from: '"Almaty Grand Hotel" <noreply@almatygrand.kz>',
    to: guestEmail,
    subject: `Бронирование #${bookingId.slice(-8).toUpperCase()} отменено`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Almaty Grand Hotel</h1>
            <p>Бронирование отменено</p>
          </div>
          <div class="content">
            <p>Уважаемый(ая) <strong>${guestName}</strong>,</p>
            <p>Ваше бронирование было отменено.</p>
            
            <p><strong>Детали:</strong></p>
            <ul>
              <li>Номер бронирования: #${bookingId.slice(-8).toUpperCase()}</li>
              <li>Категория: ${roomName}</li>
              <li>Даты: ${formatDate(checkIn)} — ${formatDate(checkOut)}</li>
            </ul>
            
            <p>Если у вас есть вопросы, пожалуйста, свяжитесь с нами по телефону +7 (727) 123-45-67.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Almaty Grand Hotel</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    console.log('📧 Cancellation email (dev mode):');
    console.log('To:', guestEmail);
    return { success: true };
  }

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error };
  }
}
