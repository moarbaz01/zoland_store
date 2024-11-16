"use client";
import { useCallback, useMemo, useState } from "react";
import TopBanner from "./TopBanner";
import { set } from "mongoose";

const Product = ({
  name,
  id,
  description,
  amount,
  image,
  region,
  category,
  isDeleted,
  stock,
  cost,
}: {
  name: string;
  id: string;
  description: string;
  amount: string;
  image: string;
  isDeleted: boolean;
  category: string;
  stock: true;
  region: string;
  cost: { id: string; amount: string; price: string }[];
}) => {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [amountSelected, setAmountSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCheckRole = useCallback(async () => {
    if (!userId || !zoneId) {
      setErrorMessage("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/checkrole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          zoneId,
          productId: "13",
          product: "mobilelegends",
        }),
      });
      const data = await res.json();
      setErrorMessage("");
      setMessage(data.username);
    } catch (error: any) {
      console.log(error);
      setMessage("Error found");
    } finally {
      setLoading(false);
    }
  }, [userId, zoneId, cost, region]);

  const handleSubmitCheckRole = async (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    await fetchCheckRole();
  };

  const total = useMemo(() => {
    return cost[amountSelected].price;
  }, [amountSelected, cost]);
  return (
    <div className="w-full">
      <TopBanner image={image} name={name} />
      <div className="flex sm:flex-row flex-col w-full max-w-screen-xl mx-auto gap-6 py-12 sm:px-6 px-4  ">
        <div className="flex-1">
          <h1 className="text-lg">Select Amount</h1>
          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4">
            {cost.map((item, i) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setAmountSelected(i)}
                  className={`rounded-xl ${
                    amountSelected === i
                      ? "bg-primary text-black"
                      : "bg-secondary"
                  } cursor-pointer bg-secondary transition px-4 py-4 h-16 flex items-center`}
                >
                  {item.amount}
                </div>
              );
            })}
          </div>
          <h1 className="text-lg mt-8 hidden sm:block">Description</h1>
          <div className="p-4 bg-secondary mt-4 rounded-xl sm:flex items-center hidden ">
            <p>{description}</p>
          </div>
        </div>

        {/* Checkout */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="p-4 bg-secondary rounded-xl">
            <h1 className="text-lg">Order Information</h1>
            <form className="flex flex-col gap-4 mt-4">
              <input
                placeholder="User ID"
                onChange={(e) => setUserId(e.target.value)}
                value={userId}
                className="rounded-xl bg-gray-800 border-2 focus:outline-primary focus:outline border-gray-700 py-2 px-4"
              />
              <input
                placeholder="( Zone ID )"
                onChange={(e) => setZoneId(e.target.value)}
                value={zoneId}
                className="rounded-xl bg-gray-800 border-2 focus:outline-primary focus:outline border-gray-700 py-2 px-4"
              />
              {message && (
                <p className="text-primary my-1">Username : {message}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 my-1">{errorMessage}</p>
              )}
              <button
                type="submit"
                onClick={handleSubmitCheckRole}
                disabled={loading}
                className="bg-primary w-full rounded-full p-2 text-black font-bold"
              >
                {loading ? "Loading..." : "Check"}
              </button>
            </form>
          </div>
          <div className="p-4 bg-secondary rounded-xl">
            <h1 className="text-lg">Payment Mode</h1>
            <div className="bg-primary w-full rounded-full p-2 flex items-center justify-center text-black mt-4 font-bold">
              UPI
            </div>
          </div>
          <div className="p-4 bg-secondary rounded-xl ">
            <div className="flex justify-between w-full">
              <p className="text-lg">Total</p>
              <p className="text-xl font-bold">Rs. {total}</p>
            </div>
            <button className="bg-primary w-full rounded-full p-2 text-black font-bold mt-4">
              Pay
            </button>
          </div>

          <div className="sm:hidden">
            <h1 className="text-lg mt-8">Description</h1>
            <div className="p-4 bg-secondary mt-4 rounded-xl flex items-center ">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;
