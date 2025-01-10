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

const init = (providerOptions: ProviderOptions, settings: Settings) => {
  if (!providerOptions.apiKey) {
    throw new Error("Brevo API key is required");
  }
  const url = providerOptions.apiUrl ?? 'https://api.brevo.com/v3/smtp/email';
  return {
    send(options: SendOptions): Promise<void> {
      return new Promise((resolve, reject) => {
        const { from, to, replyTo, subject, text, html, templateId, ...rest } = options;

        if (templateId) {
          fetch(url, {
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
              to: [{ email: to }],
              templateId,
              params: rest,
            }),
          }).then(response => {
            if (!response.ok) {
              console.error(`Brevo mailer templateId=${templateId}: got response ${response.status}`);
            }
            resolve();
          }).catch(err => {
            console.error('Brevo mailer: error', err);
            reject();
          });
        } else {
          fetch(url, {
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
              to: [{ email: to }],
              subject,
              textContent: text,
              ...rest,
            }),
          }).then(response => {
            if (!response.ok) {
              console.error(`Brevo mailer templateId=${templateId}: got response ${response.status}`);
            }
            resolve();
          }).catch(err => {
            console.error('Brevo mailer: error', err);
            reject();
          });
        }
      });
    },
  };
};

export { init };
