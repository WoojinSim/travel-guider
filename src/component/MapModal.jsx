// MapModal.jsx

import React, { useEffect } from "react";

const MapModal = (props) => {
  // 모달 끄기
  const closeMap = () => {
    props.setMapModalAnimation("closeAnimation");
    setTimeout(() => {
      props.setIsMapModalOpen(false);
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      props.setMapModalAnimation("");
    }, 500);
  }, []);

  return (
    <div className="map-modal-wrap">
      <div className={"map-modal-outer " + props.mapModalAnimation}></div>
      <div className={"map-modal-container " + props.mapModalAnimation}>
        <button className="map-modal-close-btn" onClick={closeMap}></button>
        <span className="map-modal-title">
          <b>{props.regionName}</b> 상세정보
        </span>
        <img
          className="map-img"
          src={props.mapUrl}
          alt="이미지가 로드되고 있습니다."
        />
        <span className="map-alarm-remark">
          {props.alarmText} : {props.alarmRemark}
        </span>
      </div>
    </div>
  );
};

export default MapModal;
