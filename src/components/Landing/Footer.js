import React from "react";
import tw from "twin.macro";

import { ReactComponent as SvgDecoratorBlob1 } from "../../assets/icons/svg-decorator-blob-9.svg";

const Container = tw.div`relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-gray-100 -mb-8 -mx-8 px-8 py-20 lg:py-24`;
const Content = tw.div`max-w-screen-xl mx-auto relative z-10`;
const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoText = tw.h5`px-5 ml-2 text-xl font-black tracking-wider text-gray-100`;

const CopyRightNotice = tw.p`px-5 text-center text-sm sm:text-base mt-8 md:mt-0 font-medium`;

const DecoratorBlobContainer = tw.div`absolute inset-0 overflow-hidden rounded-lg`;
const DecoratorBlob1 = tw(
  SvgDecoratorBlob1
)`absolute top-0 left-0 w-80 h-80 transform -translate-x-20 -translate-y-32 text-purple-700 opacity-50`;
const DecoratorBlob2 = tw(
  SvgDecoratorBlob1
)`absolute bottom-0 right-0 w-80 h-80 transform  translate-x-32 translate-y-48 text-purple-700 opacity-50`;

export default () => {
  return (
    <Container>
      <Content>
        <ThreeColRow>
          <LogoContainer>
            <LogoText>Studyi</LogoText>
          </LogoContainer>
          <CopyRightNotice>
            &copy; 2021 Studyi. Made By Edwin. All Rights Reserved.
          </CopyRightNotice>
        </ThreeColRow>
      </Content>
      <DecoratorBlobContainer>
        <DecoratorBlob1 />
        <DecoratorBlob2 />
      </DecoratorBlobContainer>
    </Container>
  );
};
