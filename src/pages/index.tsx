import { GetServerSideProps } from "next"
import Head from "next/head"
import { SubscribeButton } from "../components/SubscribeButton"
import { stripe } from "../services/stripe"
import styles from "./home.module.scss"

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head><title>Home | Tech News</title></Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>✌️ Hey, welcome</span>
          <h1>News about the <span>Tech</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount}/month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

// call via SSR
export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve("price_1LVKLdGS7mXz9pA0qdDDxV8z", {
    expand: ["product"]
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('it-IT', {
      style: "currency",
      currency: "EUR"
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product
    }
  }
}
