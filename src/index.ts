interface ProviderOptions {
  apiKey: string;
  apiUrl: string;
}

interface Settings {
  defaultFrom: string;
  defaultFromName: string;
  defaultReplyTo: string;
  defaultReplyToName: string;
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
  templateId?: number;
  [key: string]: unknown;
}

export default {
  init: (providerOptions: ProviderOptions, settings: Settings) => {
    if (!providerOptions.apiKey) {
      throw new Error("Brevo API key is required");
    }
    const url = providerOptions.apiUrl ?? 'https://api.brevo.com/v3/smtp/email';
    return {
      async send(options: SendOptions) {
        const { from, to, replyTo, subject, text, html, templateId, ...rest } = options;

        try {
          if (templateId) {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'API-Key': providerOptions.apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                replyTo: {
                  name: settings.defaultReplyToName,
                  email: replyTo ?? settings.defaultReplyTo,
                },
                sender: {
                  name: settings.defaultFromName,
                  email: from ?? settings.defaultFrom,
                },
                to: [ { email: to } ],
                templateId,
                params: rest,
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
                replyTo: {
                  name: settings.defaultReplyToName,
                  email: replyTo ?? settings.defaultReplyTo,
                },
                sender: {
                  name: settings.defaultFromName,
                  email: from ?? settings.defaultFrom,
                },
                to: [ { email: to } ],
                subject,
                textContent: text,
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
