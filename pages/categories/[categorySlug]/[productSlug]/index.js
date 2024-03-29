import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { SRLWrapper } from "simple-react-lightbox";
import Header from '../../../../components/Header';
import { useRouter } from 'next/router'
import Footer from '../../../../components/Footer';
import marked from 'marked';
import { getUrl } from '../../../../services/getUrl';

export async function getStaticProps(context) {

  const { locale, params } = context;

  let product;
  if (locale === undefined) {
    product = await fetch(`${getUrl()}/products?slug=${params.productSlug}`);
  } else {
    product = await fetch(`${getUrl()}/products?_locale=${locale}&slug=${params.productSlug}`);
  }
  const productData = await product.json();

  let array = [];
  if (productData.length > 0) {
    const otherLocales = productData[0].localizations;

    otherLocales.forEach(async (locale) => {
      const category = await fetch(`${getUrl()}/products/${locale._id}`);
      let categoryData = await category.json();
      array.push(categoryData);
    })
  }


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

  if (productData.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product: productData,
      header: headerData,
      footer: footerData,
      locale,
      array
    },
    revalidate: 20
  }
}

  // This function gets called at build time
  export async function getStaticPaths({ locales }) {
    // Call an external API endpoint to get posts
    const res = await fetch(`${getUrl()}/products?_locale=all`)
    const posts = await res.json()

    const paths = posts.map((post) => ({
      params: { categorySlug: post.category.slug, productSlug: post.slug},
    }))
  
  
    return {
        fallback: 'blocking',
        paths,
     };
  }

function Index({ product, header, footer, locale, array}) {

  const router = useRouter()

  const mainImage = product[0].images[0];
  const otherImages = product[0].images.filter(image => image._id !== mainImage._id);

  // product[0].images.shift();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

    return (
    <div>
    <Head>
      <script>
        {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TNGVP2B')
      }
      </script>
        <title>{product[0].title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet" />
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TNGVP2B"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      </noscript>
      <Header header={header} locale={locale} asPath={router.asPath} type="product" otherLocales={array} />
        <div className="product">
            <div className="texture">
              <div className="wrapper">
                <img className="icon" src="https://res.cloudinary.com/skodas-lt/image/upload/v1632902614/103436_category_settings_icon_1_whx2r6.svg" />
                <p className="category-title">{product[0].category.title}</p>
                {/* <img src="https://res.cloudinary.com/skodas-lt/image/upload/v1632848414/texture_g57g7o.png" /> */}
              </div>
            </div>
            <div className="wrapper">
                <div className="text">
                <h2 className="model-title">{product[0].title}</h2>
                <div className="paragraph" dangerouslySetInnerHTML={{ __html: product[0].description }} />
                {
                  product[0].files.map(file =>
                    <div key={file._id} className="pdf-list">
                      <a href={`${file.link}`} rel="noopener noreferrer" target="_blank">
                      <img src="https://res.cloudinary.com/skodas-lt/image/upload/v1633202270/51955_document_file_pdf_icon_xohnmw.png" />
                      <p>{file.title}</p>
                      </a>
                  </div>
                    )
                }
                </div>
                <div className="gallery">
                    <SRLWrapper>
                    <div className="main-image">
                        <img className="zoom-in" src="https://res.cloudinary.com/skodas-lt/image/upload/v1632847911/3044663_app_essential_in_interface_ui_icon_l8svbn.svg"/>
                        <a href={`${mainImage.url}`}>
                        <img src={`${mainImage.url}`} />
                        </a>
                    </div>
                    <div className="image-list">
                      {
                        otherImages.map(image =>
                          <a key={image.url} href={`${image.url}`}>
                          <img src={`${image.url}`} />
                          </a>
                          )
                      }
                    </div>
                    </SRLWrapper>
                </div>
            </div>
        </div>
      </main>
      <Footer footer={footer} locale={locale} />
        </div>
    )
}

export default Index
