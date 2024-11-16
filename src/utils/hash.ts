import crypto from "crypto";

type Params = Record<string, string | number>;

export const generateSign = (
  params: Params,
  key: string = "1234567890"
): string => {
  if (!params || !key) {
    throw new Error("Both params and key are required");
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const stringToHash = `${sortedParams}&${key}`;

  return crypto
    .createHash("md5")
    .update(crypto.createHash("md5").update(stringToHash).digest("hex"))
    .digest("hex");
};
