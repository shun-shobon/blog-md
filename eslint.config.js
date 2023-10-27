import base from "@shun-shobon/eslint-config-base/flat";

const config = [
  ...base,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "unicorn/template-indent": "off",
    },
  },
  {
    ignores: ["./dist/"],
  },
];

export default config;
