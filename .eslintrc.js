module.exports = {
    extends: [require.resolve("@umijs/fabric/dist/eslint")],
    globals: {
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
        page: true
    },
    rules: {
        //"comma-dangle": ["error", "never"],
        "no-else-return": "off",
        "prefer-template": "off",
        "@typescript-eslint/camelcase": "off",
        eqeqeq: 0,
        "no-restricted-syntax": 0,
        "object-shorthand": 0,
        "react/no-array-index-key": 0,
        "no-shadow": 0,
        "react-hooks/rules-of-hooks": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "arrow-body-style": 0
    }
};
