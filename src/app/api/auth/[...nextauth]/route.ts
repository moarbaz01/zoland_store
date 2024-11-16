import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import NextAuth, { AuthOptions, Session, User as UserInterface } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedUserInterface extends UserInterface {
  role: string;
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
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({
      user,
    }: {
      user: any;
    }): Promise<boolean> {
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        const newUser = new User({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        await newUser.save();
      }

      if (existingUser?.isBlocked) {
        return false;
      }

      // Attach role to the user object
      user.role = existingUser?.role || "user";
      return true;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: any;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id as string;
        token.role = (user as ExtendedUserInterface).role || "user";
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
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
