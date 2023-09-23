// RegionCard.jsx

import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

interface RegionCardProps {
  regionIso: string;
}
// TODO: 2자리 국가 ISO 코드 프롭으로 넘어오면 맞는 국가 정보 뿌리는 코드만들것!!!
const destinationList = new Map();
destinationList.set("JP", {
  name: "일본",
  nCode: "JP294232",
});
destinationList.set("CN", {
  name: "중국",
  nCode: "CN294211",
});
destinationList.set("VN", {
  name: "베트남",
  nCode: "VN293921",
});
destinationList.set("RU", {
  name: "러시아",
  nCode: "RU294459",
});

interface PostInterface {
  [key: string]: any;
}

const RegionCard: React.FC<RegionCardProps> = (props) => {
  const destinationInfo = destinationList.get(props.regionIso);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostInterface>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `http://localhost:4000/API/${destinationInfo.nCode}`
        );
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error("에러:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [loading]);

  return (
    <div className="region-card-wrap">
      {loading ? (
        <p>데이터를 불러오는 중...</p>
      ) : (
        <div>
          <span className="region-name">{destinationInfo.name}</span>
          <ul className="region-info">
            <li>{post?.descriptionInfo.publisher}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegionCard;
