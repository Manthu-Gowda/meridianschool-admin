import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import BlockCard from "../../components/BlockCards/BlockCards";
import Loader from "../../components/Loader/Loader";
import { contentTypeConfig } from "../../helpers/contentConstant";

const AdmissionsFAQ = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
<div className="home">
      {isLoading && <Loader />}
      <SubHeader title="Customize Admissions FAQ" showBack={false} showRight={false} />
      <div className="home_section">
        {contentTypeConfig
          .filter((item) => item.typeId >= 95 && item.typeId <= 96)
          .map((item) => (
            <BlockCard
              key={item.typeId}
              title={item.typeName}
              onClick={() => handleCardClick(item.typeId)}
            />
          ))}
      </div>
    </div>
  );
};

export default AdmissionsFAQ;
