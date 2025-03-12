import { generateSign } from "@/utils/hash";
import axios from "axios";

const fetchProductsList = async () => {
  const timestamp = Math.floor(Date.now() / 1000);

  const params = {
    uid: process.env.SMILE_ONE_UID!,
    email: process.env.SMILE_ONE_EMAIL!,
    product: "mobilelegends",
    time: timestamp,
  };

  const sign = generateSign(params, process.env.SMILE_ONE_API_KEY);
  console.log("sign", sign);
  const res = await axios.post(
    "https://www.smile.one/smilecoin/api/productlist",
    { ...params, sign },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log("res", res.data);

  return res.data;
};

const Test = async () => {
  const products = await fetchProductsList();
  console.log(products);
  return (
    <div>
      <h1>Test</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
};

export default Test;
