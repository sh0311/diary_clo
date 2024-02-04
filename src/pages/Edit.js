import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  //console.log(id);

  const diaryList = useContext(DiaryStateContext); //useContext 이용해 diaryList 받아오기
  //console.log(diaryList);

  const [originData, setOriginData] = useState();

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );
      console.log(targetDiary);

      if (targetDiary) {
        setOriginData(targetDiary);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [id, diaryList]); //id나 diaryList가 변할때마다 수행되도록

  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
      {/* originData가 있으면 DiaryEditor를 랜더하도록 만들어주기 */}
    </div>
  );
};

export default Edit;
