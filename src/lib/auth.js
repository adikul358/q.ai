import { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            return session
        }
    }
}

const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }