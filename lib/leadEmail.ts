import { site } from '@/lib/site';

type LeadPayload = {
  name?: string;
  phone?: string;
  postcode?: string;
  message?: string;
  service?: string;
  location?: string;
  page?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, valueHtml: string) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #E8E2D5;width:120px;vertical-align:top;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#B08D3E;font-family:Arial,Helvetica,sans-serif;">
        ${label}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #E8E2D5;vertical-align:top;font-size:16px;line-height:1.45;color:#2B2B2B;font-family:Georgia,'Times New Roman',serif;">
        ${valueHtml}
      </td>
    </tr>`;
}

/** Turn a stored path into a readable label + absolute URL for the email. */
export function formatLeadPage(page?: string) {
  const raw = (page || '').trim();
  if (!raw) return null;

  const path = raw.startsWith('http')
    ? (() => {
        try {
          const u = new URL(raw);
          return `${u.pathname}${u.search}` || '/';
        } catch {
          return raw;
        }
      })()
    : raw.startsWith('/')
      ? raw
      : `/${raw}`;

  const href = raw.startsWith('http') ? raw : `${site.domain}${path === '/' ? '' : path}`;

  const labels: Record<string, string> = {
    '/': 'Homepage',
    '/contact': 'Contact',
    '/extensions': 'Extensions',
    '/loft-conversions': 'Loft conversions',
    '/blog': 'Blog',
    '/cost-guides/loft-conversion-cost': 'Loft conversion cost guide',
  };

  const pathOnly = path.split('?')[0] || '/';
  const label = labels[pathOnly] || pathOnly.replace(/^\//, '').replace(/\//g, ' · ') || 'Homepage';

  return { path, href, label };
}

export function leadEmailSubject(lead: LeadPayload) {
  const parts = [lead.name?.trim() || 'New enquiry'];
  if (lead.service?.trim()) parts.push(lead.service.trim());
  if (lead.postcode?.trim()) parts.push(lead.postcode.trim().toUpperCase());
  return `New quote request — ${parts.join(' · ')}`;
}

export function leadEmailText(lead: LeadPayload) {
  const pageInfo = formatLeadPage(lead.page);
  const lines = [
    'New quote request from the website',
    '',
    `Name: ${lead.name ?? '—'}`,
    `Phone: ${lead.phone ?? '—'}`,
    `Postcode: ${lead.postcode ?? '—'}`,
  ];
  if (lead.service) lines.push(`Project: ${lead.service}`);
  if (lead.location) lines.push(`Area: ${lead.location}`);
  if (lead.message) {
    lines.push('', 'Message:', lead.message);
  }
  if (pageInfo) {
    lines.push('', `From page: ${pageInfo.label}`, pageInfo.href);
  }
  lines.push('', 'Call them back the same working day if you can.');
  return lines.join('\n');
}

export function leadEmailHtml(lead: LeadPayload) {
  const name = escapeHtml(lead.name?.trim() || '—');
  const phoneRaw = lead.phone?.trim() || '';
  const phoneDisplay = escapeHtml(phoneRaw || '—');
  const phoneHref = phoneRaw.replace(/[^\d+]/g, '');
  const postcode = escapeHtml((lead.postcode?.trim() || '—').toUpperCase());
  const service = lead.service?.trim() ? escapeHtml(lead.service.trim()) : '';
  const location = lead.location?.trim() ? escapeHtml(lead.location.trim()) : '';
  const message = lead.message?.trim()
    ? escapeHtml(lead.message.trim()).replace(/\n/g, '<br>')
    : '';
  const pageInfo = formatLeadPage(lead.page);

  const phoneCell = phoneHref
    ? `<a href="tel:${escapeHtml(phoneHref)}" style="color:#2B2B2B;text-decoration:none;border-bottom:2px solid #C9A961;">${phoneDisplay}</a>`
    : phoneDisplay;

  const pageCell = pageInfo
    ? `<a href="${escapeHtml(pageInfo.href)}" style="color:#2B2B2B;text-decoration:none;border-bottom:2px solid #C9A961;font-family:Arial,Helvetica,sans-serif;font-size:15px;">
        ${escapeHtml(pageInfo.label)}
      </a>
      <br>
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7A7568;">${escapeHtml(pageInfo.path)}</span>`
    : `<span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#7A7568;">Not recorded</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New quote request</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E8E2D5;">
          <tr>
            <td style="background:#1D1D1D;padding:28px 32px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C9A961;font-family:Arial,Helvetica,sans-serif;">
                J.Berry Extensions &amp; Conversions
              </p>
              <h1 style="margin:0;font-size:26px;line-height:1.2;color:#ffffff;font-weight:normal;font-family:Georgia,'Times New Roman',serif;">
                New quote request
              </h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.65);font-family:Arial,Helvetica,sans-serif;">
                Call them back the same working day if you can.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row('Name', name)}
                ${row('Phone', phoneCell)}
                ${row('Postcode', postcode)}
                ${service ? row('Project', service) : ''}
                ${location ? row('Area', location) : ''}
                ${message ? row('Message', message) : ''}
                ${row('From page', pageCell)}
              </table>
              ${
                phoneHref
                  ? `<p style="margin:28px 0 0;">
                      <a href="tel:${escapeHtml(phoneHref)}" style="display:inline-block;background:#C9A961;color:#1D1D1D;text-decoration:none;padding:14px 22px;font-size:12px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                        Call ${phoneDisplay}
                      </a>
                    </p>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #E8E2D5;background:#FAF7F0;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#7A7568;font-family:Arial,Helvetica,sans-serif;">
                Sent from the website contact form. Reply to this email only reaches the inbox owner — phone the customer directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
