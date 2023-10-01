// RegionCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useDataQuery } from "../module/apiLib";

interface RegionCardProps {
  regionIso: string;
  enableEvent: (state: boolean) => void;
}
// TODO: 2자리 국가 ISO 코드 프롭으로 넘어오면 맞는 국가 정보 뿌리는 코드만들것!!!
const destinationList = new Map();
destinationList.set("JP", { name: "일본", nCode: "JP294232" });
destinationList.set("CN", { name: "중국", nCode: "CN294211" });
destinationList.set("VN", { name: "베트남", nCode: "VN293921" });
destinationList.set("RU", { name: "러시아", nCode: "RU294459" });
destinationList.set("US", { name: "미국", nCode: "US191" });
destinationList.set("UK", { name: "영국", nCode: "GB186216" });

const RegionCard: React.FC<RegionCardProps> = (props) => {
  const destinationInfo = destinationList.get(props.regionIso);

  const { data, isLoading, isError, error } = useDataQuery(destinationInfo.nCode);
  const dataJson = data?.data;

  return (
    <Link
      className="region-card-wrap"
      to={`/info/${props.regionIso}`}
      onClick={() => {
        props.enableEvent(false);
      }}
    >
      <div className={`region-card-img ${props.regionIso}`}>
        <div className="card-img-blur"></div>
      </div>
      <div className="region-card-back">
        <span className="region-name">{destinationInfo.name}</span>
        <span className="region-lore">{dataJson?.descriptionInfo?.publisher}</span>
      </div>
    </Link>
  );
};

export default RegionCard;
