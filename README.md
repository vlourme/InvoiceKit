![InvoiceKit Hero](media/hero.png)

# InvoiceKit

InvoiceKit is a CRM solution based on VueJS and Firebase. It aims to be simple to use and extensible a maximum with a extension system which means you can add pages with CRUD principles.

## Features

At **2.x release** :
| Features | Extensible |
|:--------:|:----------:|
| Customers | Yes |
| Invoices | No |
| Contracts/Subscriptions | Yes |

You can look here for [future releases plans](https://github.com/vlourme/InvoiceKit/projects) and (here for every ideas)[https://github.com/vlourme/InvoiceKit/projects/7] we're thinking about.

## Plans for v3.x

We're planning in the 3.x version to bring a complete Extension API that will allow creating and storing data with CRUD principles and pages to display those data.

## Contribute

We'd be more than happy to receive some help and contributions. These contributions can be about some issues reported or future plans (that you can find in [Projects](https://github.com/vlourme/invoicekit/projects)).

### Development building

```bash
# Clone project
$ git clone https://github.com/vlourme/invoicekit

# install dependencies
$ npm install
# or: yarn

# start development server
$ npm run dev
# or: yarn dev

# start the firebase emulator
$ npm run dev:firebase
# or: yarn dev:firebase
```

**Important!** You'll need to setup Firebase. Create a project on [Firebase dashboard](https://console.firebase.google.com/), then copy your configuration in `nuxt.config.ts` at `modules -> '@nuxt/firebase' -> config`.

Then, while using the app, Firebase will create collections automatically.

### Documentations

Main project dependencies:

- [NuxtJS](https://nuxtjs.org) and [VueJS](https://vuejs.org) for the structure.
- [Firebase](https://firebase.google.com/docs) for storing data.
- [TailwindCSS](https://tailwindcss.com) for the UI.

### Contributions rules

While working on this project, please keep in mind a few things:

- Keep the code simple yet readable.
- As 2.x release, the codebase is now using Vue Composition API which allow us splitting code easily (cf. `composables` directory).
- We're trying to make a maximum of code on the client-side, Cloud Functions are only used for a security matter most of the time.
