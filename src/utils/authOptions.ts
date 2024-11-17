import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import {
  AuthOptions,
  Session,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async signIn({ user }: { user: any }): Promise<boolean> {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
  
        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            image: user.image,
          });
          await newUser.save();
          user.role = newUser.role;
          user.id = newUser._id.toString();
        }
  
        if (existingUser?.isBlocked) {
          return false;
        }
  
        // Attach role to the user object
        user.role = existingUser?.role || "user";
        user.id = existingUser?._id.toString();
        return true;
      },
  
      async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
        if (user) {
          token.id = user.id as string;
          token.role = user.role || "user";
        }
        return token;
      },
  
      async session({
        session,
        token,
      }: {
        session: any;
        token: JWT;
      }): Promise<Session> {
        session.user.id = token.id;
        session.user.role = token.role;
        return session;
      },
      redirect({ url, baseUrl }) {
        return baseUrl;
      },
    },
  };