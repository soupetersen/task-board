import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import firebase from "../../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      const firebaseRef = doc(firebase, "users", String(token.sub));
      const lastDonate = await getDoc(firebaseRef).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.data().lastDonate.toDate();
        } else {
          return null;
        }
      });

      try {
        return {
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate,
        };
      } catch {
        return {
          ...session,
          id: null,
          vip: false,
          lastDonate: null,
        };
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        return true;
      } catch (err) {
        console.log("DEU ERRO: ", err);
        return false;
      }
    },
  },
});
