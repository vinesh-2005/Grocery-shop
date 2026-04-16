import nodemailer from 'nodemailer';

// Create reusable transporter using Ethereal (free test SMTP)
// In production, replace with Gmail, SendGrid, etc.
const createTransporter = async () => {
  // Use environment variables if configured, otherwise create Ethereal test account
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback: Ethereal test account (emails viewable at ethereal.email)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Beautiful HTML email template wrapper
const emailTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f7f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#166534,#22c55e);padding:30px 40px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:28px;letter-spacing:1px;">🛒 FreshGrocer</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Your Trusted Grocery Partner</p>
    </div>
    <!-- Body -->
    <div style="padding:32px 40px;">
      <h2 style="color:#166534;margin:0 0 16px;font-size:22px;">${title}</h2>
      ${bodyContent}
    </div>
    <!-- Footer -->
    <div style="background:#f8faf9;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} FreshGrocer. All rights reserved.</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

// --- Email Senders ---

export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = await createTransporter();

    const html = emailTemplate('Welcome to FreshGrocer! 🎉', `
      <p style="color:#374151;line-height:1.7;">Hi <strong>${user.name}</strong>,</p>
      <p style="color:#374151;line-height:1.7;">Thank you for joining FreshGrocer! Your account has been created successfully.</p>
      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0;color:#166534;"><strong>Account Details:</strong></p>
        <p style="margin:6px 0 0;color:#374151;">📧 Email: ${user.email}</p>
        <p style="margin:4px 0 0;color:#374151;">👤 Role: ${user.role.replace('_', ' ').toUpperCase()}</p>
      </div>
      <p style="color:#374151;line-height:1.7;">Start exploring fresh vegetables, fruits, and groceries today!</p>
      <a href="http://localhost:5173" style="display:inline-block;background:linear-gradient(135deg,#166534,#22c55e);color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">Start Shopping →</a>
    `);

    const info = await transporter.sendMail({
      from: '"FreshGrocer" <noreply@freshgrocer.com>',
      to: user.email,
      subject: '🎉 Welcome to FreshGrocer!',
      html,
    });

    console.log('✉️  Welcome email sent:', info.messageId);
    console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info) || 'N/A');
    return info;
  } catch (error) {
    console.error('Email send failed (welcome):', error.message);
  }
};

export const sendOrderConfirmationEmail = async (user, order) => {
  try {
    const transporter = await createTransporter();

    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;text-align:right;">₹${item.price}</td>
      </tr>
    `).join('');

    const html = emailTemplate('Order Confirmed! 📦', `
      <p style="color:#374151;line-height:1.7;">Hi <strong>${user.name}</strong>,</p>
      <p style="color:#374151;line-height:1.7;">Your order has been placed successfully! Here's your order summary:</p>
      
      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Order ID</p>
        <p style="margin:0;color:#166534;font-weight:700;font-size:16px;">#${order._id.toString().slice(-8).toUpperCase()}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f0fdf4;">
            <th style="padding:10px 12px;text-align:left;color:#166534;font-size:13px;">Item</th>
            <th style="padding:10px 12px;text-align:center;color:#166534;font-size:13px;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#166534;font-size:13px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="text-align:right;margin-top:12px;padding-top:12px;border-top:2px solid #22c55e;">
        <p style="margin:0;color:#374151;">Shipping: <strong>₹${order.shippingPrice}</strong></p>
        <p style="margin:4px 0;color:#374151;">Tax: <strong>₹${order.taxPrice}</strong></p>
        <p style="margin:8px 0 0;color:#166534;font-size:20px;font-weight:800;">Total: ₹${order.totalPrice}</p>
      </div>

      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
        <p style="margin:0;color:#166534;"><strong>Delivery Address:</strong></p>
        <p style="margin:6px 0 0;color:#374151;">${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}</p>
        <p style="margin:4px 0 0;color:#374151;">Payment: ${order.paymentMethod}</p>
      </div>
    `);

    const info = await transporter.sendMail({
      from: '"FreshGrocer" <noreply@freshgrocer.com>',
      to: user.email,
      subject: `📦 Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
      html,
    });

    console.log('✉️  Order confirmation email sent:', info.messageId);
    console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info) || 'N/A');
    return info;
  } catch (error) {
    console.error('Email send failed (order):', error.message);
  }
};

export const sendOrderStatusEmail = async (userEmail, userName, orderId, status) => {
  try {
    const transporter = await createTransporter();

    const statusColors = {
      'Processing': '#f59e0b',
      'Shipped': '#3b82f6',
      'Out for Delivery': '#8b5cf6',
      'Delivered': '#22c55e',
      'Cancelled': '#ef4444',
    };

    const statusEmojis = {
      'Processing': '⏳',
      'Shipped': '🚚',
      'Out for Delivery': '📍',
      'Delivered': '✅',
      'Cancelled': '❌',
    };

    const color = statusColors[status] || '#6b7280';
    const emoji = statusEmojis[status] || '📋';

    const html = emailTemplate(`Order Status Update ${emoji}`, `
      <p style="color:#374151;line-height:1.7;">Hi <strong>${userName}</strong>,</p>
      <p style="color:#374151;line-height:1.7;">There's an update on your order:</p>
      
      <div style="text-align:center;margin:28px 0;">
        <div style="display:inline-block;background:${color};color:white;padding:14px 36px;border-radius:30px;font-size:18px;font-weight:700;letter-spacing:0.5px;">
          ${emoji} ${status}
        </div>
      </div>

      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Order ID</p>
        <p style="margin:0;color:#166534;font-weight:700;font-size:16px;">#${orderId.toString().slice(-8).toUpperCase()}</p>
      </div>

      ${status === 'Delivered' ? '<p style="color:#374151;line-height:1.7;">🎉 Your order has been delivered! We hope you enjoy your fresh groceries.</p>' : ''}
      
      <a href="http://localhost:5173/order/${orderId}" style="display:inline-block;background:linear-gradient(135deg,#166534,#22c55e);color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">View Order Details →</a>
    `);

    const info = await transporter.sendMail({
      from: '"FreshGrocer" <noreply@freshgrocer.com>',
      to: userEmail,
      subject: `${emoji} Order #${orderId.toString().slice(-8).toUpperCase()} - ${status}`,
      html,
    });

    console.log('✉️  Status email sent:', info.messageId);
    console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info) || 'N/A');
    return info;
  } catch (error) {
    console.error('Email send failed (status):', error.message);
  }
};
