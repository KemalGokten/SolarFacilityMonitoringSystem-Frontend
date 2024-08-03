require("dotenv").config();
const { REACT_APP_GRAPHQL_URI } = process.env;

module.exports = {
  schema: REACT_APP_GRAPHQL_URI || "http://localhost:4000/graphql",
  documents: "./src/graphql/**/*.ts",
  generates: {
    "./src/graphql/generated.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
      },
    },
  },
};
