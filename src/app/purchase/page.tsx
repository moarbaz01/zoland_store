"use client";

import { useState } from "react";

export default function PurchasePage() {
  const [userid, setUserid] = useState("");
  const [zoneid, setZoneid] = useState("");
  const [product, setProduct] = useState("mobilelegends"); // Default product
  const [productid, setProductid] = useState("");
  const [status, setStatus] = useState("");

  const handlePurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("Processing...");

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, zoneid, product, productid }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Success: Order ID`);
        console.log("Data", data);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="">
      <h1>Purchase</h1>
      <form onSubmit={handlePurchase}>
        <div>
          <label>
            User ID:
            <input
              type="text"
              className="text-black"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Zone ID:
            <input
              type="text"
              value={zoneid}
              className="text-black"
              onChange={(e) => setZoneid(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Product ID:
            <input
              type="text"
              value={productid}
              className="text-black"
              onChange={(e) => setProductid(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
