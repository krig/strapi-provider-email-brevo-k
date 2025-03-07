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
    send: async (options: SendOptions) => {
      const { from, to, replyTo, subject, text, html, templateId, ...rest } = options;
      let body: Record<string, any> = {
        replyTo: {
          name: settings.defaultReplyToName,
          email: replyTo ?? settings.defaultReplyTo,
        },
        sender: {
          name: settings.defaultFromName,
          email: from ?? settings.defaultFrom,
        },
        to: [{ email: to }],
      };

      if (templateId) {
        body = {
          ...body,
          templateId,
          params: rest,
        };
      } else {
        body = {
          ...body,
          subject,
          htmlContent: html,
          textContent: text,
          ...rest,
        };
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'API-Key': providerOptions.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error(`Brevo mailer body=${body}: got response ${response.status}`);
        console.log(`Error: ${await response.text()}`);
      } else {
        console.log(`OK: ${await response.text()}`);
      }
    },
  };
};

export { init };
