import React from 'react'
import Head from 'next/head'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { getUrl } from '../../services/getUrl';

export async function getStaticProps(context) {

  const { locale, defaultLocale } = context;

  let categories;
  if (locale === undefined) {
    categories = await fetch(`${getUrl()}/categories?_sort=updatedAt:DESC`);
  } else {
    categories = await fetch(`${getUrl()}/categories?_locale=${locale}&_sort=updatedAt:DESC`);
  }
  const categoriesData = await categories.json();

  let header;
  if (locale === undefined) {
    header = await fetch(`${getUrl()}/header`);
  } else {
    header = await fetch(`${getUrl()}/header?_locale=${locale}`);
  }
  const headerData = await header.json();

  let footer;
  if (locale === undefined) {
    footer = await fetch(`${getUrl()}/footer`);
  } else {
    footer = await fetch(`${getUrl()}/footer?_locale=${locale}`);
  }
  const footerData = await footer.json();

  return {
    props: {
      categories: categoriesData,
      header: headerData,
      footer: footerData,
      locale
    },
    revalidate: 2
  }
}

function Index({ categories, header, footer, locale }) {
  const router = useRouter()

    return (
        <div>
    <Head>
        <title>CATEGORIES</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet" />
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      <Header header={header} locale={locale} asPath={router.asPath} type="categories"/>
        <div className="categories-content">
            <div className="wrapper">
              {
                categories.map(category => 
                  <Link key={category._id} href={`/categories/${category.slug}`} locale={category.locale} passHref>
                    <a>
                  <div className="item" style={{ backgroundImage: `url('${category.image.url}')`}}>
                    <h1>{category.title}</h1>
                  </div>
                  </a>
                  </Link>
                  )
              }
                   {/* <Link href={`/categories`} passHref>
                    <a>
                  <div className="item" style={{ backgroundImage: `url('https://unsplash.it/700/700')`}}>
                    <h1>TEST TEST</h1>
                  </div>
                  </a>
                  </Link>
                  <Link href={`/categories`} passHref>
                    <a>
                  <div className="item" style={{ backgroundImage: `url('https://unsplash.it/700/700')`}}>
                    <h1>TEST TEST</h1>
                  </div>
                  </a>
                  </Link> */}
            </div>
        </div>
      </main>
      <Footer footer={footer} locale={locale} />
        </div>
    )
}

export default Index
