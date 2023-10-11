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
destinationList.set("JP", {
  name: "일본",
  nCode: "JP294232",
  lore: "아름다운 자연과 다양한 문화를 가진 나라",
});
destinationList.set("CN", {
  name: "중국",
  nCode: "CN294211",
  lore: "지역에 따라 과거와 현재, 미래가 공존하는 나라",
});
destinationList.set("VN", {
  name: "베트남",
  nCode: "VN293921",
  lore: "역사적 건축물과 고층 빌딩이 공존하는 역동적인 나라",
});
destinationList.set("RU", {
  name: "러시아",
  nCode: "RU294459",
  lore: "광활한 땅을 기반으로 자연과 예술이 펼쳐진 나라",
});
destinationList.set("US", {
  name: "미국",
  nCode: "US191",
  lore: "여러 개의 주와 하나의 수도로 이루어진 나라",
});
destinationList.set("UK", {
  name: "영국",
  nCode: "GB186216",
  lore: "수천 년의 역사가 그대로 간직된 매력적인 나라",
});

const RegionCard: React.FC<RegionCardProps> = (props) => {
  const destinationInfo = destinationList.get(props.regionIso);

  const { data, isLoading, isError, error } = useDataQuery(
    destinationInfo.nCode
  );
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
        {isLoading && <span className="region-lore">로딩중...</span>}
        {!isLoading && isError && (
          <span className="region-lore">데이터를 불러올 수 없습니다.</span>
        )}
        {!isLoading && !isError && (
          <span className="region-lore">{destinationInfo.lore}</span>
        )}
      </div>
    </Link>
  );
};

export default RegionCard;
