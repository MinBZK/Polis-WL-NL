# polis-e2e

End-To-End Tests written with cypress.io

## Dependencies

* node `16.17.0`

## Setup

```sh
# System dependencies for Cypress
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

npm install
npm test
```

## Notes

* Email tests require `maildev` to be running - this is automatically setup in devcontainer
* Run `npm run embed-test-server` before running the `integration` and `embed` tests since they need a locally served site to embed the iframe contents in.
  * **This must be run in the same environment as the server** - you will `ERR_CONN_REFUSED` if you try to run this on your laptop/host machine and the server is running in the devcontainer even though you can navigate to it just fine in your browser - possibly due to some x-site mitigation.
* The `comment-translation.secrets` tests requires that you have Google Translate API configured in `server` with credit - see `server/.envrc.example` for details.
* We use [`cypress-terminal-report`](https://github.com/archfz/cypress-terminal-report) display logs in the console in case a test has failed.
* The default base url for running tests against, is http://localhost:8000
  * You may override any cypress-related command this like so: `CYPRESS_BASE_URL=http://123.45.67.89.sslip.io npm test`
* `cypress/integration/polis/`: where we store our tests
* `cypress/support/commands.js`: where we keep oft-used commands, e.g., for logging in, creating conversations, etc.
* `cypress/support/index.js`: where we keep code we wish to run during initial setup, e.g., to ensure default users present.
* For tests against features that require third-party credentials when self-hosted, we use filenames like `*.secrets.spec.js`.
  * This allows someone to easily exclude them from test runs.
