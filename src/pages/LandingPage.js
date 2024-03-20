import React from "react";
import tw from "twin.macro";
import AnimationRevealPage from "../utils/helpers/AnimationRevealPage.js";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import MainFeature from "../components/Landing/MainFeature";
import FeatureWithSteps from "../components/Landing/FeatureWithSteps";
import FAQ from "../components/Landing/FAQ";
import Footer from "../components/Landing/Footer";
import heroScreenshotImageSrc from "../assets/img/dashboard-screenshot.png";
import tasksScreenshotImageSrc from "../assets/img/tasks-screenshot.png";
import TeamIllustrationSrc from "../assets/icons/design-illustration-2.svg";
import CurveSrc from "../assets/icons/curve.svg"

// This is the code for the landing page. 
// The sections of the landing page are located in /components, making it easier to maintain.

export default () => {
    // Subheading CSS
    const Subheading = tw.span`uppercase tracking-widest font-bold text-purple-500`;

    // Highlighted Text CSS
    const HighlightedText = tw.span`bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600`;

    return (

        // AnimationRevealPage gives each component a sliding in animation.
        <>
            <AnimationRevealPage>

                <Hero roundedHeaderButton={true} imageDecoratorBlob={true}/>

                <MainFeature
                    subheading={<Subheading>Introduction?</Subheading>}
                    description={"German psychologist Hermann Ebbinghaus was the scientist behind the forgetting curve. His research found that memories weaken over time, and " +
                    "the biggest drop in retention happens soon after learning."}
                    secondaryDesription={"Ebbinghaus concluded that revising a day, 3 days and 6 days after something is learnt is significantly beneficial for long term memory."}
                    imageSrc={CurveSrc}
                    imageBorder={true}
                    button={false}
                    textOnLeft={false}
                    imageDecoratorBlob={true}
                    subheading={""}
                    heading={(<>What is the <HighlightedText> Forgetting curve?</HighlightedText></>)}/>
                <Features
                    subheading={<Subheading>Features</Subheading>}
                    heading={
                        <>
                            Here are the <HighlightedText>Features. </HighlightedText>
                        </>
                    }
                />
                <MainFeature
                    subheading={<Subheading>Dashboard</Subheading>}
                    imageSrc={heroScreenshotImageSrc}
                    imageBorder={true}
                    imageDecoratorBlob={true}
                />

                <MainFeature
                    subheading={<Subheading>Tasks List</Subheading>}
                    imageSrc={tasksScreenshotImageSrc}
                    imageBorder={true}
                    purpleButtonText={"Try Studyi"}
                    heading={
                        <>
                            Simple and clear list of<HighlightedText> Topics.</HighlightedText>
                        </>
                    }
                    textOnLeft={false}
                    description={"Studyi allows you to create topics. These are essentially topics which require memorising. Studyi will automatically plan the revisions."}
                    secondaryDesription={"This is where you can view all your topics. You can easily see when they are due, when they were created and the current revision status of the topic."}
                    imageDecoratorBlob={true}
                />
                <FeatureWithSteps
                    subheading={<Subheading>STEPS</Subheading>}
                    heading={
                        <>
                            Easy to <HighlightedText>Get Started.</HighlightedText>
                        </>
                    }
                    textOnLeft={false}
                    imageSrc={TeamIllustrationSrc}
                    imageDecoratorBlob={true}
                    decoratorBlobCss={tw`xl:w-40 xl:h-40 opacity-20 -translate-x-1/2 left-1/2`}
                />
                <FAQ
                    subheading={<Subheading>FAQS</Subheading>}
                    heading={
                        <>
                            You have <HighlightedText>Questions ?</HighlightedText>
                        </>
                    }
                    faqs={[
                        {
                            question: "How much does Studyi cost?",
                            answer: "Nothing. Studyi is completely free.",
                        },
                        {
                            question: "How can Studyi help me improve?",
                            answer:
                                "By using Studyi, we record what percentage of your topics you revise each day, then display it on your dashboard. " +
                                "Using this data, you can clearly see how you are going with your revisions and improve in your own ways.",
                        },
                    ]}
                />
            </AnimationRevealPage>
            <Footer/>
        </>
    );
};
