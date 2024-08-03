require("dotenv").config();
const { REACT_APP_API_URL } = process.env;
const GRAPHQL_API_URL = `${REACT_APP_API_URL}/graphql`;

module.exports = {
  schema: GRAPHQL_API_URL || "http://localhost:4000/graphql",
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
