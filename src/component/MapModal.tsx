// MapModal.jsx

import React, { useEffect } from "react";

interface MapModalProps {
  setIsMapModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMapModalAnimation: React.Dispatch<React.SetStateAction<string>>;
  mapModalAnimation: string;
  alarmLvl: number;
  alarmText: string;
  alarmRemark: string;
  mapUrl: string;
  regionName: string;
}

const MapModal: React.FC<MapModalProps> = (props) => {
  // 모달 끄기

  useEffect(() => {
    setTimeout(() => {
      props.setMapModalAnimation("");
    }, 500);
  }, []);

  return (
    <div className="map-modal-wrap">
      <div className={"map-modal-outer " + props.mapModalAnimation}></div>
      <div className={"map-modal-container " + props.mapModalAnimation}>
        <span className="map-modal-title">
          <b>{props.regionName}</b> 여행경보
        </span>
        <img
          className="map-img"
          src={props.mapUrl}
          alt="이미지가 로드되고 있습니다."
        />
        <div className="map-alarm-wrap">
          <div className={`safe-lvl lvl-${props.alarmLvl}`}>
            {props.alarmText}
          </div>
          <span className="map-alarm-remark">{props.alarmRemark}</span>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
