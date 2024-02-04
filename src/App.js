import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useReducer, useRef } from "react";

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
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const dummyData = [
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
];

function App() {
  const [data, dispatch] = useReducer(reducer, dummyData);

  //console.log(new Date().getTime());
  const dataId = useRef(6);

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
