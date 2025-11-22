import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import FindAccountPage from "./FindAccountPage";
import IdResultPage from "./IdResultPage";
import FindPasswordPage from "./FindPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";
import MainPage from "./MainPage";
import Plantdiary from './Plantdiary';
import WriteMemoPage from "./WriteMemoPage";
import Information from "./Information";
import IdChange from "./IdChange";
import ChangePassword from "./ChangePassword";
import NicknameChange from "./NicknameChange";
import Withdrawal from "./Withdrawal";
import Community from "./Community";
import CommunitySettings from "./CommunitySettings";
import CreatePost from "./CreatePost";
import Search from "./Search";
import UsageHistory from "./UsageHistory";
import CommentHistory from "./CommentHistory";
import RecentUsage from "./RecentUsage";
import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions";
import CommunityRules from "./CommunityRules";
import InterestedPosts from "./InterestedPosts";
import LikedPosts from "./LikedPosts";
import PostDetail from "./PostDetail";
import QADetail from "./QADetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/find-account" element={<FindAccountPage />} />
      <Route path="/id-result" element={<IdResultPage />} />
      <Route path="/find-password" element={<FindPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/plant-diary" element={<Plantdiary />} />
      <Route path="/write-memo" element={<WriteMemoPage />} />
      <Route path="/information" element={<Information />} />
      <Route path="/id-change" element={<IdChange />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/nickname-change" element={<NicknameChange />} />
      <Route path="/withdrawal" element={<Withdrawal />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community-settings" element={<CommunitySettings />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/search" element={<Search />} />
      <Route path="/usage-history" element={<UsageHistory />} />
      <Route path="/comment-history" element={<CommentHistory />} />
      <Route path="/recent-usage" element={<RecentUsage />} />
      <Route path="/faq" element={<FrequentlyAskedQuestions />} />
      <Route path="/community-rules" element={<CommunityRules />} />
      <Route path="/interested-posts" element={<InterestedPosts />} />
      <Route path="/liked-posts" element={<LikedPosts />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/qa/:id" element={<QADetail />} />
    </Routes>
  );
}
