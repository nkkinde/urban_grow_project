import React, { useEffect, useState } from "react";
import "./Information.css";
import { useNavigate } from "react-router-dom";
import { useUserNickname } from "./UserNickname";
import BottomNav from "./BottomNav";

function Information() {
  const navigate = useNavigate();
  const { nickname } = useUserNickname();
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }

    // 저장된 디바이스 정보 복구
    const savedDevice = localStorage.getItem("connectedBLEDevice");
    if (savedDevice) {
      setConnectedDevice(JSON.parse(savedDevice));
    }
  }, []);

  const handleBluetoothConnect = async () => {
    if (!navigator.bluetooth) {
      alert("이 브라우저는 블루투스를 지원하지 않습니다.");
      return;
    }

    try {
      setIsConnecting(true);

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "device_information"],
      });

      setConnectedDevice({
        name: device.name || "알 수 없는 디바이스",
        id: device.id,
      });

      localStorage.setItem(
        "connectedBLEDevice",
        JSON.stringify({
          name: device.name || "알 수 없는 디바이스",
          id: device.id,
        })
      );

      alert(`✅ ${device.name || "디바이스"}에 연결되었습니다!`);
    } catch (error) {
      if (error.name !== "NotFoundError") {
        console.error("블루투스 연결 실패:", error);
        alert("블루투스 연결에 실패했습니다.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBluetoothDisconnect = () => {
    setConnectedDevice(null);
    localStorage.removeItem("connectedBLEDevice");
    alert("블루투스 연결이 해제되었습니다.");
  };

  return (
    <div className="Info-container">
      {/* 상단 헤더 */}
      <div className="header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 className="Info-title">내 정보</h2>
      </div>

      {/* 캐릭터 정보 */}
      <div className="Info-profile-box">
        <div className="Info-character-circle">캐릭터</div>
        <div className="character-name">{nickname}</div>
      </div>

      {/* 메뉴 항목 */}
      <div style={{ width: "100%" }}>
        {/* 블루투스 연결 버튼 */}
        <div
          className="menu-item device-connect-btn"
          onClick={
            connectedDevice ? handleBluetoothDisconnect : handleBluetoothConnect
          }
          style={{
            backgroundColor: connectedDevice ? "#ff6b6b" : "white",
            color: connectedDevice ? "white" : "#333",
          }}
        >
          {connectedDevice ? (
            <>
              <span>
                ✓ {connectedDevice.name} 연결됨{" "}
                <span style={{ fontSize: "12px", opacity: 0.8 }}>
                  (연결 해제)
                </span>
              </span>
            </>
          ) : (
            <>
              <span>{isConnecting ? "연결 중..." : "🔗 디바이스 연결"}</span>
              <span className="arrow">{isConnecting ? "..." : "→"}</span>
            </>
          )}
        </div>

        <div className="menu-item" onClick={() => navigate("/change-password")}>
          <span>🔐 비밀번호 변경</span>
          <span className="arrow">→</span>
        </div>
        <div className="menu-item" onClick={() => navigate("/nickname-change")}>
          <span>✏️ 닉네임 변경</span>
          <span className="arrow">→</span>
        </div>
        <div className="menu-item withdrawal-btn" onClick={() => navigate("/withdrawal")}>
          <span>🚪 회원 탈퇴</span>
          <span className="arrow">→</span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default Information;
