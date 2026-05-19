import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import Lifecycle from './components/Lifecycle'
import Quickstart from './components/Quickstart'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <main className="relative">
        <Hero />
        <Features />
        <Lifecycle />
        <Quickstart />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
