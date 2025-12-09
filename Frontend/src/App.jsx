import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BlogTitles from "./pages/BlogTitles.jsx";
import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GenerateImages from "./pages/GenerateImages.jsx";
import Layout from "./pages/Layout.jsx";
import RemoveBackground from "./pages/RemoveBackground.jsx";
import RemoveObject from "./pages/RemoveObject.jsx";
import WriteArticle from "./pages/WriteArticle.jsx";
import ReviewResume from "./pages/ReviewResume.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import {Toaster} from 'react-hot-toast';
import SummarizeText from "./pages/SummarizeText.jsx";
import LanguageTranslator from "./pages/LanguageTranslator.jsx";
import SocialMediaCaption from "./pages/SocialMediaCaption.jsx";
import EmailWriter from "./pages/EmailWriter.jsx";
import ProductDescription from "./pages/ProductDescription.jsx";
import GenerateBlog from "./pages/GenerateBlog.jsx";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const MotionWrapper = ({ children }) => (
  <motion.div
    initial={pageTransition.initial}
    animate={pageTransition.animate}
    exit={pageTransition.exit}
    transition={pageTransition.transition}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Toaster />
      <Routes location={location} key={location.pathname}>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <MotionWrapper>
              <Home />
            </MotionWrapper>
          }
        />

        {/* AI Layout with Nested Routes */}
        <Route path="/ai" element={<Layout />}>
          <Route
            index
            element={
              <MotionWrapper>
                <Dashboard />
              </MotionWrapper>
            }
          />
          <Route
            path="remove-object"
            element={
              <MotionWrapper>
                <RemoveObject />
              </MotionWrapper>
            }
          />
          <Route
            path="review-resume"
            element={
              <MotionWrapper>
                <ReviewResume />
              </MotionWrapper>
            }
          />
          <Route
            path="write-article"
            element={
              <MotionWrapper>
                <WriteArticle />
              </MotionWrapper>
            }
          />
          <Route
            path="remove-background"
            element={
              <MotionWrapper>
                <RemoveBackground />
              </MotionWrapper>
            }
          />
          <Route
            path="blog-titles"
            element={
              <MotionWrapper>
                <BlogTitles />
              </MotionWrapper>
            }
          />
          <Route
            path="summarize-text"
            element={
              <MotionWrapper>
                <SummarizeText />
              </MotionWrapper>
            }
          />
          <Route
            path="translate-text"
            element={
              <MotionWrapper>
                <LanguageTranslator />
              </MotionWrapper>
            }
          />
          <Route
            path="generate-blog"
            element={
              <MotionWrapper>
                <GenerateBlog />
              </MotionWrapper>
            }
          />
          <Route
            path="social-caption"
            element={
              <MotionWrapper>
                <SocialMediaCaption />
              </MotionWrapper>
            }
          />
          <Route
            path="generate-email"
            element={
              <MotionWrapper>
                <EmailWriter />
              </MotionWrapper>
            }
          />
          <Route
            path="product-description"
            element={
              <MotionWrapper>
                <ProductDescription />
              </MotionWrapper>
            }
          />

          <Route
            path="community"
            element={
              <MotionWrapper>
                <Community />
              </MotionWrapper>
            }
          />
          <Route
            path="generate-images"
            element={
              <MotionWrapper>
                <GenerateImages />
              </MotionWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
