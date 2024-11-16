import Link from "next/link";

const Navbar = () => {
  return (
    <div className="h-16 bg-secondary flex items-center px-4 justify-center">
      <div className="max-w-screen-xl w-full m-auto flex items-center justify-between">
        <div className="logo">
          <Link href="/">
            <h1 className="text-xl font-bold">
              Zoland<span className="text-primary">Store</span>
            </h1>
          </Link>
        </div>
        <Link href="/login" className="">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
