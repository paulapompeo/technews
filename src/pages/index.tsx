import {
  // GetServerSideProps,
  GetStaticProps
} from "next"
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

// NEXT -> ways to call api
// Client-side: depends on user action
// Server-side: dynamic data from user (user session)
// Static side generation: blog, product on e-commerce (google index)

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

// SSR -> dinamic
// export const getServerSideProps: GetServerSideProps = async () => {
//   const price = await stripe.prices.retrieve("price_1LVKLdGS7mXz9pA0qdDDxV8z", {
//     expand: ["product"]
//   })

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat('it-IT', {
//       style: "currency",
//       currency: "EUR"
//     }).format(price.unit_amount / 100)
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

// SSG -> static (if all users see the same thing)
export const getStaticProps: GetStaticProps = async () => {
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
    },
    revalidate: 60 * 60 * 24 // 24hrs
  }
}
