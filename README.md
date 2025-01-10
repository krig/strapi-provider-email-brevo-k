# Strapi email provider for Brevo

## Example configuration

```js
module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'strapi-provider-email-brevo-k',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultFromName: 'My Name',
        defaultFrom: 'myemail@brevo.com',
        defaultReplyToName: 'My Name',
        defaultReplyTo: 'myemail@brevo.com',
      },
    },
  },
  // ...
});
```
