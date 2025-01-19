// "use client";

const MaintenancePage = () => {
  // useEffect(() => {
  //   document.body.style.overflow = "hidden"; // Hide scrollbars
  //   return () => {
  //     document.body.style.overflow = "auto"; // Restore scrollbars
  //   };
  // }, []);
  return (
    <div className="flex flex-col fixed top-0 left-0 h-full w-full  justify-center items-center  bg-black text-center">
      <h1 className="md:text-3xl text-2xl font-bold text-primary">
        Website Under Maintenance
      </h1>
      <p className="mt-4 text-xl text-gray-600">For Recharge Contact Admin</p>
      <div className="mt-6">
        <p className="text-lg">
          Call or WhatsApp:{" "}
          <a
            href="https://wa.me/+917085414571"
            className="text-primary font-semibold hover:underline"
          >
            7085414571
          </a>
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
