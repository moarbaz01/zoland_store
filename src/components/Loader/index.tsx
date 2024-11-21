import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  );
};

export default Loader;