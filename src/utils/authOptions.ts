import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import { AuthOptions, Session } from "next-auth";
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
    strategy: "jwt", // Use JWT-based sessions
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }: { user: any }): Promise<boolean> {
      await dbConnect();

      // Check if user exists in the database
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        const newUser = new User({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        await newUser.save();

        // Assign role and ID after creating new user
        user.role = newUser.role || "user"; // Default role
        user.id = newUser._id.toString(); // Convert _id to string
        user.name = newUser.name;
      } else {
        // If user exists, assign the role and ID
        user.role = existingUser.role || "user"; // Default to 'user' if no role
        user.id = existingUser._id.toString(); // Convert _id to string
        user.name = existingUser.name;
      }

      // If the user is blocked, return false
      if (existingUser?.isBlocked) {
        return false;
      }

      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
      // If this is the initial sign-in, add user details to the token
      if (user) {
        token.id = user.id; // Add user.id from signIn callback
        token.role = user.role || "user"; // Add user.role
        token.name = user.name;
        // Add user.name
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
      // Attach the ID and role from the JWT token to the session object
      if (token) {
        session.user.id = token.id; // Add id to session.user
        session.user.role = token.role; // Add role to session.user
        session.user.name = token.name;
      }
      return session;
    },

    redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};
