"use client";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
const Analytics = dynamic(() => import("@/components/Dashboard/Analytics"), {
  loading: () => <Loader />,
});

const Page = () => {
  return <Analytics />;
};

export default Page;
