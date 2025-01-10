# Strapi email provider for Brevo

## Example configuration

```js
module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'brevo-k',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultFrom: 'myemail@brevo.com',
        defaultReplyTo: 'myemail@brevo.com',
      },
    },
  },
  // ...
});
```
