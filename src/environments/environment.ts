// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl:"http://127.0.0.1:8000/api",
  mediaUrl:"http://127.0.0.1:8000/",
  pusher: {
    key: 'eb822e2261f4f9a0b85d',
  }
};
