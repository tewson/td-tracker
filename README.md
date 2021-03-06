# TD Tracker (working title)
[![Netlify Status](https://api.netlify.com/api/v1/badges/8c113750-4ed6-4aff-9bdf-98c88be722d6/deploy-status)](https://app.netlify.com/sites/td-tracker-beta/deploys)

The [Oireachtas website](https://www.oireachtas.ie/) is very useful for browsing TDs' contributions. However, it lacks 2 things:

1. Easily accessible attendance data, and
2. High level summary on a TD's contributions and attendance.

This project aims to provide both things.
We do that by first making the published attendance records more machine-readable (while still relatively human-readable). We then link attendance data to contribution data and present it in a single calendar view.

## Getting Started

### Prerequisites

- Node.js 10+

### Running A Local Development Server

#### 1. Install dependencies

```sh
npm install
```

#### 2. Run the development server

```sh
npm start
```

Watch the CLI output for the development server URL. It's usually http://localhost:8080.

## Usages

| Command                    | Description                           |
| -------------------------- | ------------------------------------- |
| `npm start`                | Run a local development server        |
| `npm run attendance-input` | Run in the attendance data entry mode |
| `npm run lint`             | Lint the source code with ESLint      |

## Data sources

- Houses of the Oireachtas Open Data APIs - https://api.oireachtas.ie/
- Publications by the House of the Oireactas - https://www.oireachtas.ie/en/publications/

## Contributing

We'd love your contributions! Be it code, data, suggestions, or simply error corrections. Check out our [contributing guidelines](CONTRIBUTING.md).

## Licence

Any data from the Oireachtas is licensed under the [Oireachtas (Open Data) PSI Licence](https://www.oireachtas.ie/en/open-data/license/), which incorporates the [Creative Commons Attribution 4.0 International Licence](http://creativecommons.org/licenses/by/4.0/).

The rest of the project is [licensed under the terms of the MIT licence](./LICENSE.md).
