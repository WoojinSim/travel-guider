// RegionCard.jsx

import React, { useState, useEffect } from "react";

interface RegionCardProps {
  regionIso: string;
}
// TODO: 2자리 국가 ISO 코드 프롭으로 넘어오면 맞는 국가 정보 뿌리는 코드만들것!!!

const RegionCard: React.FC<RegionCardProps> = (props) => {
  // TODO: 백앤드 통신 만들것!!!
  return (
    <div className="region-card-wrap">
      <span className="regin-name">{props.regionIso}</span>
    </div>
  );
};

export default RegionCard;
