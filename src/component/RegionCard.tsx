// RegionCard.jsx

import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface RegionCardProps {
  regionIso: string;
  setRegionInfo: React.Dispatch<React.SetStateAction<Object | String | undefined>>;
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

interface PostInterface {
  [key: string]: any; // API에서 받아오는값이 너무많아 정의가 힘듦
}

const RegionCard: React.FC<RegionCardProps> = (props) => {
  const destinationInfo = destinationList.get(props.regionIso);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [post, setPost] = useState<PostInterface>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse = await axios.get(`http://localhost:4000/API/${destinationInfo.nCode}`);
        setErrorReason(null);
        setPost(response.data);
        setLoading(false);
      } catch (error: any) {
        setErrorReason(error.code);
        setLoading(false);
      }
    };
    fetchData();
  }, [loading]);

  return (
    <Link
      className="region-card-wrap"
      to={`/info/${props.regionIso}`}
      onClick={() => {
        props.setRegionInfo(post);
        props.enableEvent(false);
      }}
    >
      {loading ? (
        <p>데이터를 불러오는 중...</p>
      ) : (
        <div>
          <span className="region-name">{destinationInfo.name}</span>
          {errorReason && <p>데이터를 불러오지 못했습니다.({errorReason})</p>}
          <ul className="region-info">
            <li>{post?.descriptionInfo.publisher}</li>
          </ul>
        </div>
      )}
    </Link>
  );
};

export default RegionCard;
