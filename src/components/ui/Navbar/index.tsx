const Navbar = () => {
  return (
    <div className="h-16 bg-secondary flex items-center px-4 justify-center">
      <div className="max-w-screen-xl w-full m-auto flex items-center justify-between">
        <div className="logo">
          <h1 className="text-xl font-bold">
            Zoland<span className="text-primary">Store</span>
          </h1>
        </div>
        <div className="nav-links">
          <button className="text-white">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
