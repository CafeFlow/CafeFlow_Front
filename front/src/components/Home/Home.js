import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cafeflowLogo from "../icons/cafeflowLogo.png";
import { API_URL } from "../Constant.js";
import styles from "./Home.module.css";
import seatGreen from "../icons/seatGreen.png";
import seatRed from "../icons/seatRed.png";
import seatYellow from "../icons/seatYellow.png";
import searchButton from "../icons/searchButton.png";
import filledGreen from "../icons/filledGreen.png";
import filledYellow from "../icons/filledYellow.png";
import filledRed from "../icons/filledRed.png";
import line from "../icons/line.png";

const { kakao } = window;

const Home = ({ setIsTestButtonClicked, isTestButtonClicked }) => {
  const [center, setCenter] = useState({
    lat: 37.550433,
    lng: 127.074055,
  });

  const navigate = useNavigate();

  const navigateToReview = () => {
    console.log("asd");
    navigate("/review");
  };

  const [selectedButton, setSelectedButton] = useState("세종대");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [modalData, setModalData] = useState({
    name: "",
    count: 0,
    address: "",
  });
  const [seatImagePath, setSeatImagePath] = useState("");

  useEffect(() => {
    const getSeatImagePath = (count) => {
      if (count <= 15) {
        return filledRed;
      } else if (count > 15 && count <= 31) {
        return filledYellow;
      } else {
        return filledGreen;
      }
    };

    setSeatImagePath(getSeatImagePath(modalData.count));
  }, [modalData]);

  const closeModal = () => {
    console.log("modal 종료!");
    setIsModalVisible(false);
    setIsTestButtonClicked(false);

    // 모달 창 종료 시 이미지와 글자색이 원래대로 돌아감
    if (activeOverlay) {
      const prevLogoImage = activeOverlay.querySelector(`.${styles.logo}`);
      const prevCafeName = activeOverlay.querySelector(`.${styles.CafeName}`);
      if (prevLogoImage.src.includes(filledGreen)) {
        prevLogoImage.src = seatGreen;
        activeOverlay.style.backgroundColor = "";
        prevCafeName.style.color = "black";
      } else if (prevLogoImage.src.includes(filledYellow)) {
        prevLogoImage.src = seatYellow;
        activeOverlay.style.backgroundColor = "";
        prevCafeName.style.color = "black";
      } else if (prevLogoImage.src.includes(filledRed)) {
        prevLogoImage.src = seatRed;
        activeOverlay.style.backgroundColor = "";
        prevCafeName.style.color = "black";
      }

      setActiveOverlay(null); // activeOverlay 상태를 null로 초기화합니다.
    }
  };

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);

    // axios로 가져온 데이터로 마커 생성
    axios
      .get(`${API_URL}/view-map`)
      .then((response) => {
        const data = response.data;
        console.log(data);

        // data.forEach((element) => {
        //   let seatImage;
        //   if (element.count <= 15) {
        //     seatImage = seatRed;
        //   } else if (element.count > 15 && element.count <= 31) {
        //     seatImage = seatYellow;
        //   } else {
        //     seatImage = seatGreen;
        //   }

        //   let borderColor;

        //   if (element.count <= 15) {
        //     borderColor = "#F96356";
        //   } else if (element.count > 15 && element.count <= 31) {
        //     borderColor = "#FFC85F";
        //   } else {
        //     borderColor = "#00F29B";
        //   }

        //   const overlayContent = `
        //   <div id="overlay_${element.name}" class="${styles.overlayContainer}" style="border-color: lightgray">
        //     <div class="${styles.logoContainer}">
        //       <img class="${styles.logo}" src=${seatImage} />
        //       <h2 class="${styles.CafeName}">${element.name}</h2>
        //     </div>
        //   </div>`;

        //   const overlay = new kakao.maps.CustomOverlay({
        //     content: overlayContent,
        //     map: map,
        //     position: new kakao.maps.LatLng(element.xmap, element.ymap),
        //   });

        //   kakao.maps.event.addListener(overlay, "click", function () {
        //     setIsModalVisible(true); // 모달을 보이게 합니다.
        //     setModalContent(element.name); // 클릭한 오버레이의 정보를 모달에 전달합니다. 이 부분은 필요에 따라 수정하면 됩니다.
        //   });
        // });

        data.forEach((element) => {
          let seatImage;
          if (element.count <= 15) {
            seatImage = seatRed;
          } else if (element.count > 15 && element.count <= 31) {
            seatImage = seatYellow;
          } else {
            seatImage = seatGreen;
          }

          let borderColor;

          if (element.count <= 15) {
            borderColor = "#F96356";
          } else if (element.count > 15 && element.count <= 31) {
            borderColor = "#FFC85F";
          } else {
            borderColor = "#00F29B";
          }

          const overlayContainer = document.createElement("div");
          overlayContainer.id = `overlay_${element.name}`;
          overlayContainer.className = styles.overlayContainer;
          overlayContainer.style.borderColor = "lightgray";

          const logoContainer = document.createElement("div");
          logoContainer.className = styles.logoContainer;

          const logoImage = document.createElement("img");
          logoImage.className = styles.logo;
          logoImage.src = seatImage;

          const cafeName = document.createElement("h2");
          cafeName.className = styles.CafeName;
          cafeName.innerText = element.name;

          logoContainer.appendChild(logoImage);
          logoContainer.appendChild(cafeName);
          overlayContainer.appendChild(logoContainer);

          overlayContainer.addEventListener("click", function () {
            setIsModalVisible(true);
            setModalData({
              name: element.name,
              count: element.count,
              address: element.address, // 가정: address라는 속성이 API 응답에 있음
            });
            setIsTestButtonClicked(true); // 이 부분을 추가합니다.
            setActiveOverlay(overlayContainer);

            // count 값에 따른 이미지와 텍스트 색상 설정
            if (element.count <= 15) {
              logoImage.src = filledRed; // filledGreen 이미지의 경로로 변경해주세요.
              overlayContainer.style.backgroundColor = "#F96356";
            } else if (element.count > 15 && element.count <= 31) {
              logoImage.src = filledYellow; // filledYellow 이미지의 경로로 변경해주세요.
              overlayContainer.style.backgroundColor = "#FFC85F";
            } else {
              logoImage.src = filledGreen; // filledRed 이미지의 경로로 변경해주세요.
              overlayContainer.style.backgroundColor = "#00F29B";
            }
            cafeName.style.color = "white"; // 텍스트의 색상을 흰색으로 설정
          });

          const overlay = new kakao.maps.CustomOverlay({
            content: overlayContainer,
            map: map,
            position: new kakao.maps.LatLng(element.xmap, element.ymap),
          });
        });
      })

      .catch((error) => {
        console.error(error);
      });
  }, [center]);

  return (
    <>
      {!isTestButtonClicked && (
        <>
          <div
            className={`${styles.title} ${
              isTestButtonClicked ? styles.hideContent : ""
            }`}
          >
            <p className={styles.h2}>CafeFlow</p>
            <p className={styles.p}>
              카페플로우를 통해 카페 내 현재 사람 수를 확인하세요.
            </p>
          </div>
          <div
            className={`${styles.inputContainer} ${
              isTestButtonClicked ? styles.hideContent : ""
            }`}
          >
            <div className={styles.search_container}>
              <input className={styles.search_input} />
              <img src={line} className={styles.line} />
              <img src={searchButton} className={styles.magnifier_icon} />
            </div>
          </div>
        </>
      )}
      <div
        className={
          isTestButtonClicked ? styles.buttonContainer2 : styles.buttonContainer
        }
      >
        <button
          style={{
            marginRight: "10px",
            borderRadius: "32px",
            borderColor: selectedButton === "세종대" ? "#F96356" : "#D7CCCB",
          }}
          className={styles.univButton}
          onClick={() => {
            setCenter({ lat: 37.550433, lng: 127.074055 });
            setSelectedButton("세종대"); // 선택된 버튼 업데이트
          }}
        >
          <p className="school">세종대</p>
        </button>
        <button
          style={{
            borderRadius: "32px",
            borderColor: selectedButton === "건국대" ? "#F96356" : "#D7CCCB",
          }}
          className={styles.univButton}
          onClick={() => {
            setCenter({ lat: 37.54313, lng: 127.077501 });
            setSelectedButton("건국대"); // 선택된 버튼 업데이트
          }}
        >
          <p className="school">건국대</p>
        </button>
        {/* <button
          onClick={() => {
            setIsModalVisible(true);
            setIsTestButtonClicked(true);
          }}
        >
          test
        </button>{" "} */}
      </div>
      <div className={styles.bigContainer}>
        <div
          className={isTestButtonClicked ? styles.container3 : styles.container}
        >
          <div className={styles.leftAd}>광고</div>
          <div
            id="map"
            className={
              isTestButtonClicked ? styles.centerMap2 : styles.centerMap
            }
          ></div>
          <div className={styles.rightAd}>광고</div>
        </div>
        <div
          className={
            isTestButtonClicked ? styles.mobileunderAd2 : styles.mobileunderAd
          }
        >
          밑 광고
        </div>
      </div>
      {isModalVisible && (
        <div className={styles.modalBackdrop} onClick={closeModal}></div>
      )}
      <div
        className={`${styles.modal} ${isModalVisible ? styles.visible : ""}`}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: "0px" }}>{modalData.name}</h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: "0px", color: "red" }}>별점 4.0</p>
              <hr
                style={{
                  height: "1.5vh",
                  marginLeft: "2vw",
                  marginRight: "2vw",
                }}
              />
              <p style={{ margin: "0px", color: "#796262" }}> 리뷰 490</p>
            </div>
          </div>
          <div
            style={{
              width: "30vw",
              height: "5vh",
              borderRadius: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "-1vh",
              border: "1px solid #D7CCCB",
            }}
          >
            <p style={{ fontSize: "1.3em" }}>{modalData.count} / 45</p>
            <img
              src={seatImagePath}
              alt="Seat Status"
              style={{ height: "3vh", marginLeft: "10px" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>영업 중</p>
          <hr
            style={{
              height: "1.5vh",
              marginLeft: "2vw",
              marginRight: "2vw",
            }}
          />
          <p style={{ color: "#796262" }}>23:00에 영업종료</p>
        </div>
        <p style={{ marginTop: "0px", color: "#796262" }}>
          {modalData.address}
        </p>
      </div>
    </>
  );
};

export default Home;
