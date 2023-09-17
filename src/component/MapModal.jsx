// MapModal.jsx

import React from "react";

const MapModal = (props) => {
  // 모달 끄기
  const closeModal = () => {
    props.setIsMapModalOpen(false);
  };

  return (
    <div className="map-modal-outer">
      <div className="map-modal-container">
        <button className="map-modal-close-btn" onClick={closeModal}></button>
        <span className="map-modal-title">
          <b>{props.regionName}</b> 상세정보
        </span>
        <img
          className="map-img"
          src={props.mapUrl}
          alt="이미지가 로드되고 있습니다."
        />
      </div>
    </div>
  );
};

export default MapModal;
