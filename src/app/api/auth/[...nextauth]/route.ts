import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import { AuthOptions, Session, User as UserInterface } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";


interface ExtendedUserInterface extends UserInterface {
  role : string
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    signIn: async ({
      user,
    }: {
      user: ExtendedUserInterface & AdapterUser;
    }): Promise<boolean> => {
      dbConnect();
      const isUser = await User.findOne({ email: user.email });
      if (!isUser) {
        const newUser = new User({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        await newUser.save();
      }
      if (isUser && isUser.isBlocked) {
        return false;
      }
      user.role = isUser?.role || "user";
      return true;
    },
  },
  async jwt({
    token,
    user,
  }: {
    token: JWT;
    user?: UserInterface | AdapterUser;
  }): Promise<any> {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },
  async session({ session, token }): Promise<Session> {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
    return session;
  },
};
