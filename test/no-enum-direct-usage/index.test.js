const fs = require("fs");
const { ESLintUtils } = require("@typescript-eslint/experimental-utils");
const rule = require("../../rules/no-enum-direct-usage");

const ruleTester = new ESLintUtils.RuleTester({
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run("test-rule", rule, {
  valid: [
    {
      code: fs.readFileSync(`${__dirname}/valid/1.ts`, "utf8"),
    },
  ],
  invalid: [
    {
      code: fs.readFileSync(`${__dirname}/invalid/1.ts`, "utf8"),
      errors: [{}],
    },
  ],
});
