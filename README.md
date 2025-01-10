# Strapi email provider for Brevo

Note: This plugin should be considered experimental until 1.0.0 is released.

Why use this and not `strapi-provider-email-brevo`?

- No external dependencies (uses node fetch)
- Handle sender name and email in a more correct way
- Send templated email using Brevo mail templates

## Example configuration

```js
module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: '@k-ziran/strapi-provider-email-brevo-k',
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
