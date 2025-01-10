import assert from 'node:assert';

interface ProviderOptions {
  apiKey: string;
  apiUrl: string;
}

interface Settings {
  defaultFrom: string;
  defaultReplyTo: string;
}

interface SendOptions {
  from?: string;
  to: string;
  cc: string;
  bcc: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  [key: string]: unknown;
}

const splitMail = (mail: string) => {
  if (mail.match(/<(.*?)>/g)) {
    const matches = mail.match(/(.*?)<(.*?)>/g)?.map((a) => a.replace(/<|>/g, ""));
    if (matches) {
      return { name: matches[0], email: matches[1] };
    }
  }
  return { email: mail };
}

export default {
  init: (providerOptions: ProviderOptions, settings: Settings) => {
    assert(providerOptions.apiKey, "Brevo API key is required");
    const url = providerOptions.apiUrl ?? 'https://api.brevo.com/v3/smtp/email';
    return {
      async send(options: SendOptions) {
        const { from, to, replyTo, subject, text, html, ...rest } = options;

        try {
          if ('templateId' in rest) {
            const { templateId, ...params } = rest;
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'API-Key': providerOptions.apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                replyTo: splitMail(replyTo ?? settings.defaultReplyTo),
                sender: splitMail(from ?? settings.defaultFrom),
                to: [ splitMail(to) ],
                templateId,
                params,
              }),
            });
            if (!response.ok) {
              console.error(`Brevo mailer templateId=${templateId}: got response ${response.status}`);
              return false;
            }
            return response.ok;
          } else {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'API-Key': providerOptions.apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                htmlContent: html,
                replyTo: splitMail(replyTo ?? settings.defaultReplyTo),
                sender: splitMail(from ?? settings.defaultFrom),
                subject,
                textContent: text,
                to: [ splitMail(to) ],
                ...rest,
              }),
            });
            if (!response.ok) {
              console.error(`Brevo mailer: got response ${response.status}`);
              return false;
            }
            return response.ok;
          }
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    };
  },
};
