import React from "react";
import styled from "styled-components";
import tw from "twin.macro";

import Header from "../Headers/LandingHeader";
import { ReactComponent as SvgDecoratorBlob1 } from "../../assets/icons/decorator-blob.svg";
import DesignIllustration from "../../assets/icons/design-illustration.svg";
import { ReactComponent as SvgDotPattern } from "../../assets/icons/dot-pattern.svg";

const Container = tw.div`relative`; //py-10 md:py-24
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto py-10 md:py-24`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;
const DecoratorBlob = styled(SvgDotPattern)(() => [
  tw`w-20 h-20 absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 fill-current text-purple-500 z-10`,
]);
const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-800 leading-tight`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg text-gray-800`;

const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  button {
    ${tw`mt-8 inline-block w-48 tracking-wide text-center py-4 bg-gradient-to-r hover:from-purple-500 to-blue-500 from-purple-600 via-indigo-600 to-blue-600 text-gray-100 font-bold rounded-full focus:outline-none transition duration-300`}
  }
`;

const IllustrationContainer = tw.div`flex justify-center lg:justify-end items-center`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3 z-10`}
`;

export default ({ roundedHeaderButton }) => {
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading>
              Studying backed by the
              <span className="bg-clip-text text-transparent text-gradient bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"> forgetting curve</span>.
            </Heading>
            <Paragraph>
              Simply put in what you need to study, and we will remind you when
              you need to.
            </Paragraph>
            <Actions>
              <a href="/create-account">
                <button>Get Started</button>
              </a>
            </Actions>
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <DecoratorBlob css={null} />
              <img
                tw="min-w-0 w-full max-w-lg xl:max-w-3xl"
                src={DesignIllustration}
                alt="Design Illustration"
              />
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <DecoratorBlob1 />
      </Container>
    </>
  );
};
