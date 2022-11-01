import { useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/styles.module.scss";
import firebase from "../services/firebaseConnection";
import Image from "next/image";
import BoardUser from "../../public/images/board-user.svg";

import { collection, query, getDocs } from "firebase/firestore";

type data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};
interface HomeProps {
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<data[]>(JSON.parse(data));
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={BoardUser} alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se..</h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>

        {donaters.length !== 0 && <h1>Apoiadores: </h1>}
        <div className={styles.donaters}>
          {donaters.map((item) => (
            <Image width={65} height={65} key={item.id} src={item.image} alt="Usuários 1" />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const firebaseRef = collection(firebase, "users");
  const q = query(firebaseRef);
  const querySnapshot = await getDocs(q);

  const data = JSON.stringify(
    querySnapshot.docs.map((u) => {
      return {
        id: u.id,
        ...u.data(),
      };
    })
  );

  return {
    props: {
      data,
    },
    revalidate: 60 * 60, // Atualiza a cada 60 minutos.
  };
};
