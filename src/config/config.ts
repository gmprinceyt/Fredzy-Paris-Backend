import { config } from "dotenv";
config();

const _config = {
  port: process.env.PORT || 3000,
};

export const variables = Object.freeze(_config);

