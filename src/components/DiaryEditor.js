import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "./../App";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || "";

//const getStringDate = (date) => {
//  return date.toISOString().slice(0, 10);
//};

const DiaryEditor = ({ isEdit, originData }) => {
  const navigate = useNavigate();

  const [date, setDate] = useState(getStringDate(new Date()));
  console.log(date);
  const [emotion, setEmotion] = useState(3); //어떤 감정을 선택했는지 저장하는 state
  const [content, setContent] = useState(""); // 작성한 content의 상태 저장
  const contentRef = useRef(); //작성 안되었을 때 contentArea에 focus 주려고

  const { onCreate, onEdit } = useContext(DiaryDispatchContext);

  const handleClickemote = (emotion) => {
    setEmotion(emotion);
  };

  const handleSubmit = () => {
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }

    if (
      window.confirm(
        isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
      }
    }

    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);

  return (
    <div className="DiaryEditor">
      <MyHeader
        headText={isEdit ? "일기 수정하기" : "새 일기쓰기"} //edit인지 아닌지에 따라 header 달라짐
        leftChild={<MyButton text={"뒤로가기"} onClick={() => navigate(-1)} />}
      />

      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input-box">
            <input
              className="input-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickemote}
                isSelected={it.emotion_id === emotion}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요?"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
            <MyButton
              text={"작성완료"}
              type={"positive"}
              onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiaryEditor;
