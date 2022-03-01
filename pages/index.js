import Head from 'next/head'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from 'swiper';
import 'swiper/css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router'
import { getUrl } from '../services/getUrl';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export async function getStaticProps(context) {

  const { locale, defaultLocale } = context;

  let page;
  if (locale === undefined) {
    page = await fetch(`${getUrl()}/pagrindinis`);
  } else {
    page = await fetch(`${getUrl()}/pagrindinis?_locale=${locale}`);
  }
  const pageData = await page.json();

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
      page: pageData,
      header: headerData,
      footer: footerData,
      locale
    },
    revalidate: 2
  }
}

export default function Home({ page, header, footer, locale}) {

  const router = useRouter()

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
        <title>SKODAS.LT</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet" />
        <meta name="description" content="skodas.lt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ fontSize: locale == 'ru' ? '80% !important' : '100%'}}>
        <Header header={header} locale={locale} asPath={router.asPath} type={`home`}/>
        <Swiper
            // spaceBetween={50}
            // modules={[Navigation, Pagination]}
            slidesPerView={1}
            onSwiper={(swiper) => console.log(swiper)}
            navigation
            pagination={{ clickable: true }}
            autoplay
          >
            {
              page.Slideshow.images.map(image =>
                <SwiperSlide key={image._id}>
                  <div className="slide-item" style={{ backgroundImage: `url('${image.url}')`}}>
                    
                  </div>
                </SwiperSlide>
                )
            }
          </Swiper>
          <div className="about-content">
            <div className="wrapper">
              <div className="text">
                <h2>{page.title}</h2>
                <div className="paragraph" dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </div>
          </div>
      </main>
        <Footer footer={footer} locale={locale} />
    </div>
  )
}
