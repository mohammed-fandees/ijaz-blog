module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Disable specific TypeScript rules that are too strict for this project
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-empty-interface": "off",
    // Allow empty arrow functions for event handlers
    "@typescript-eslint/no-empty-function": [
      "error",
      { allow: ["arrowFunctions"] },
    ],
    // Disable the hook dependencies warning since we handle them manually
    "react-hooks/exhaustive-deps": "off",
    // Allow img elements since we're handling optimization elsewhere
    "@next/next/no-img-element": "off",
  },
};
