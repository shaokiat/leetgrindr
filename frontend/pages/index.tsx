import type { NextPage } from "next";
import Head from "next/head";
import Container from "../components/Container";
import HeroSection from "../components/HeroSection";

const Landing: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>LeetGrindr</title>
      </Head>
      {/* <div className="relative"> */}
      <HeroSection />
      {/* </div> */}
    </Container>
  );
};

export default Landing;
