import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useAuth = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);
  return user;
};

export default useAuth;
