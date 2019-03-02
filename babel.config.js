/* eslint-disable */

const presets = [
  "@babel/preset-env",
  "@babel/preset-react",
  "@babel/preset-flow"
];

const plugins = [

];

const overrides = [
  {
    test: ["packages/www-a"],
    plugins: [
      ["module-resolver", {
        "alias": { "~": "./src/scripts" }
      }],
      ["import", {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css"
      }]
    ]
  },
  {
    test: ["packages/www-b"],
    plugins: [
      ["module-resolver", {
        "alias": { "~": "./src/scripts" }
      }]
    ]
  },
]

module.exports = {
  presets,
  plugins,
  overrides
}
