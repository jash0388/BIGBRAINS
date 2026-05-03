import PageLoader from "../components/PageLoader";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustedBy from "../components/TrustedBy";
import StudentFeatures from "../components/StudentFeatures";
import FacultyFeatures from "../components/FacultyFeatures";
import NBASection from "../components/NBASection";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div style={{ background: "#F8FAFF", minHeight: "100vh" }}>
      <PageLoader />
      <Navbar />
      <Hero />
      <TrustedBy />
      <StudentFeatures />
      <FacultyFeatures />
      <NBASection />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
