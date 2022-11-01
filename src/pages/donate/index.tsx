import styles from "./styles.module.scss";
import Head from "next/head";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import firebase from "../../services/firebaseConnection";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import rocket from "../../../public/images/rocket.svg";
//paypal client id AUpX7acJmH08U2R4cbXsU6TQZawmyhsL81Q3By0J6AyicWozYp2Ip-OnFAmLv-IPxXk-ZqjrCFArBwOq
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

interface DonateProps {
  user: {
    nome: string;
    id: string;
    image: string;
  };
}

export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false);
  async function handleSaveDonate() {
    await setDoc(doc(firebase, "users", user.id), {
      donate: true,
      lastDonate: new Date(),
      image: user.image,
    })
      .then((doc) => {
        setVip(true);
        console.log("Donate cadastrado com sucesso!");
      })
      .catch((e) => {
        setVip(false);
        console.log("Erro ao salvar o donate!: ", e);
      });
  }

  return (
    <>
      <Head>Ajude a plataforma board a ficar online!</Head>
      <main className={styles.container}>
        <Image src={rocket} alt="Seja apoiador" />

        {vip && (
          <div className={styles.vip}>
            <Image src={user.image} alt="Imagem perfil" />
            <span>Parabéns! Você é um novo apoiador.</span>
          </div>
        )}
        <h1>Seja um apoiador do projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>Apareça na nossa home e tenha funcionalidades exclusivas!</strong>

        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "1",
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions
              .order!.capture()
              .then(function (details) {
                console.log("Compra aprovada: " + details.payer.name.given_name);
                handleSaveDonate();
              })
              .catch((e) => {
                console.log("Compra não concluida!");
              });
          }}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = {
    nome: session.user?.name,
    id: session.id,
    image: session.user?.image,
  };

  return {
    props: {
      user,
    },
  };
};
