import { siteConfig } from '@/config/site';

// Note: @react-pdf/renderer is client-side only. For server-side PDF generation,
// we'll use a simpler HTML-to-text approach that can be rendered by the client.

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  discount?: number;
  total: number;
  paymentStatus: string;
  orderNumber?: string;
  notes?: string;
}

// TODO-REVIEW: All user-supplied fields (customerName, customerEmail, etc.) are
// interpolated into HTML without escaping. Add an HTML-escape utility before
// production use to prevent XSS when this HTML is rendered in browser previews.
export function generateInvoiceHtml(invoice: InvoiceData): string {
  const lineItemsHtml = invoice.lineItems.map(item => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">AED ${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">AED ${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }
    .logo-accent { color: #4ECDC4; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #1a1a1a; }
    .invoice-number { color: #666; font-size: 14px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 10px 12px; text-align: left; background: #f8f9fa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; border-bottom: 2px solid #e5e7eb; }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    th:nth-child(2) { text-align: center; }
    .totals { margin-top: 24px; }
    .totals td { padding: 6px 12px; }
    .totals .total-row { font-weight: 700; font-size: 18px; border-top: 2px solid #1a1a1a; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #999; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-paid { background: #d1fae5; color: #065f46; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-draft { background: #f3f4f6; color: #4b5563; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo"><span class="logo-accent">▲</span> ${siteConfig.name.toUpperCase()}</div>
      <p style="margin: 4px 0 0; color: #999; font-size: 13px;">${siteConfig.tagline}</p>
      <p style="margin: 2px 0 0; color: #999; font-size: 12px;">${siteConfig.email} · ${siteConfig.phone}</p>
    </div>
    <div style="text-align: right;">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <span class="status status-${invoice.paymentStatus}">${invoice.paymentStatus.toUpperCase()}</span>
    </div>
  </div>

  <div style="display: flex; gap: 40px; margin-bottom: 30px;">
    <div class="section" style="flex: 1;">
      <div class="section-title">Bill To</div>
      <p style="margin: 0; font-weight: 600;">${invoice.customerName}</p>
      <p style="margin: 2px 0; color: #666; font-size: 14px;">${invoice.customerEmail}</p>
      ${invoice.customerPhone ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">${invoice.customerPhone}</p>` : ''}
      ${invoice.customerAddress ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">${invoice.customerAddress}</p>` : ''}
    </div>
    <div class="section" style="text-align: right;">
      <div class="section-title">Details</div>
      <p style="margin: 0; font-size: 14px;"><strong>Date:</strong> ${invoice.date}</p>
      ${invoice.dueDate ? `<p style="margin: 2px 0; font-size: 14px;"><strong>Due:</strong> ${invoice.dueDate}</p>` : ''}
      ${invoice.orderNumber ? `<p style="margin: 2px 0; font-size: 14px;"><strong>Order:</strong> ${invoice.orderNumber}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsHtml}
    </tbody>
  </table>

  <table class="totals" style="width: 300px; margin-left: auto;">
    <tr><td>Subtotal</td><td style="text-align: right;">AED ${invoice.subtotal.toFixed(2)}</td></tr>
    ${invoice.discount ? `<tr><td style="color: #059669;">Discount</td><td style="text-align: right; color: #059669;">-AED ${invoice.discount.toFixed(2)}</td></tr>` : ''}
    <tr><td>VAT (${invoice.vatRate}%)</td><td style="text-align: right;">AED ${invoice.vatAmount.toFixed(2)}</td></tr>
    <tr class="total-row"><td>Total</td><td style="text-align: right;">AED ${invoice.total.toFixed(2)}</td></tr>
  </table>

  ${invoice.notes ? `<div style="margin-top: 30px; padding: 16px; background: #f8f9fa; border-radius: 8px; font-size: 13px; color: #666;"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}

  <div class="footer">
    <p>${siteConfig.name} · Dubai, UAE · TRN: Pending</p>
    <p>This is a computer-generated invoice. No signature required.</p>
  </div>
</body>
</html>`;
}
