import React, { createContext, useState, useContext } from "react";

// Context 생성
const UserNicknameContext = createContext();

export function UserNicknameProvider({ children }) {
  const saveNickname = localStorage.getItem("nickname")
  const [nickname, setNickname] = useState(saveNickname||"사용자"); // 초기 닉네임 설정

  return (
    <UserNicknameContext.Provider value={{ nickname, setNickname }}>
      {children}
    </UserNicknameContext.Provider>
  );
}

// Context를 사용하기 위한 커스텀 훅
export function useUserNickname() {
  return useContext(UserNicknameContext);
}