import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useReducer, useRef, useEffect } from "react";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE":
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    case "REMOVE":
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    case "EDIT":
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

/*const dummyData = [
  {
    id: 1,
    emotion: 1,
    content: "오늘의 일기 1번",
    date: 1706752091012
  },
  {
    id: 2,
    emotion: 2,
    content: "오늘의 일기 2번",
    date: 1706752091013
  },
  {
    id: 3,
    emotion: 3,
    content: "오늘의 일기 3번",
    date: 1706752091014
  },
  {
    id: 4,
    emotion: 4,
    content: "오늘의 일기 4번",
    date: 1706752091015
  }
]; */

function App() {
  /*useEffect(() => {
    //localStorage.setItem("item1", 10);
    //localStorage.setItem("item2", "20");
    //localStorage.setItem("item3", JSON.stringify({ value: 30 }));
    const item1 = localStorage.getItem("item1");
    const item2 = localStorage.getItem("item2");
    const item3 = JSON.parse(localStorage.getItem("item3"));
    console.log(item1, item2, item3);
  });*/

  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const localData = localStorage.getItem("diary");
    if (localData) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      ); //id 내림차순으로 정렬(게시글 생성할 때 id뭐로 해야할지 정해야해서)
      dataId.current = parseInt(diaryList[0].id) + 1; //새 게시글 id 설정

      //console.log(diaryList);
      //console.log(dataId);

      dispatch({ type: "INIT", data: diaryList });
    }
    //diaryList를 app 컴포넌트가 가지는 data state가 가지는 초기 state로 초기화 해주기
  });

  //console.log(new Date().getTime());
  const dataId = useRef(0);

  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
    dataId.current += 1;
  };

  //Remove
  const onRemove = (targetId) => {
    dispatch({
      type: "REMOVE",
      targetId
    });
  };

  //Edit
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        targetId,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
  };
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
