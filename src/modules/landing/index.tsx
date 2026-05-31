import { Navbar } from './components/navbar'
import { Hero } from './components/hero'
import { HowItWorks } from './components/how-it-works'
import { About } from './components/about'
import { Features } from './components/features'
import { Speed } from './components/speed'
import { Faq } from './components/faq'
import { Cta } from './components/cta'
import { Footer } from './components/footer'

export function LandingView() {
  return (
    <main className='h-dvh snap-y snap-mandatory overflow-x-hidden overflow-y-auto scroll-smooth' id='main'>
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <Features />
      <Speed />
      <Faq />
      <Cta />
      <Footer />
    </main>
  )
}
