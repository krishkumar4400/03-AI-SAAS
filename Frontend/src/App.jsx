
import { Route, Routes } from "react-router-dom";
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
import { Toaster } from "react-hot-toast";
import SummarizeText from "./pages/SummarizeText.jsx";
import LanguageTranslator from "./pages/LanguageTranslator.jsx";
import SocialMediaCaption from "./pages/SocialMediaCaption.jsx";
import EmailWriter from "./pages/EmailWriter.jsx";
import ProductDescription from "./pages/ProductDescription.jsx";
import GenerateBlog from "./pages/GenerateBlog.jsx";
import Login from "./pages/Login.jsx";

const App = () => {
  return (
    <Routes>
      <Toaster />
      {/* Home Page */}
      <Route path="/" element={<Home />} />
      <Route path="/post/login" element={<Login />} />

      {/* AI Layout with Nested Routes */}
      <Route path="/ai" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="remove-object" element={<RemoveObject />} />
        <Route path="review-resume" element={<ReviewResume />} />
        <Route path="write-article" element={<WriteArticle />} />
        <Route path="remove-background" element={<RemoveBackground />} />
        <Route path="blog-titles" element={<BlogTitles />} />
        <Route path="summarize-text" element={<SummarizeText />} />
        <Route path="translate-text" element={<LanguageTranslator />} />
        <Route path="generate-blog" element={<GenerateBlog />} />
        <Route path="social-caption" element={<SocialMediaCaption />} />
        <Route path="generate-email" element={<EmailWriter />} />
        <Route path="product-description" element={<ProductDescription />} />

        <Route path="community" element={<Community />} />
        <Route path="generate-images" element={<GenerateImages />} />
      </Route>
    </Routes>
  );
};

export default App;
