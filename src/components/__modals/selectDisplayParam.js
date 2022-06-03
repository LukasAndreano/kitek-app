import React, { useCallback, useEffect, useState } from "react";
import {
  Div,
  Placeholder,
  Search,
  SegmentedControl,
  SimpleCell,
  Spinner,
} from "@vkontakte/vkui";
import { useDispatch, useSelector } from "react-redux";
import { getGroups, getTeachers } from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import {
  setGroups,
  setSelected,
  setTeachers,
} from "../../storage/reducers/main";

const SelectDisplayParam = ({ toBack }) => {
  const groups = useSelector(getGroups);
  const teachers = useSelector(getTeachers);

  const [text, setText] = useState("");
  const [option, setOption] = useState("groups");

  const [displayParam, setDisplayParam] = useState([]);

  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    const teachersReq = await api(`teachers`, `GET`);
    const groupsReq = await api(`groups`, `GET`);

    if (teachersReq.response && groupsReq.response) {
      dispatch(setTeachers(teachersReq.teachers));
      dispatch(setGroups(groupsReq.groups));

      setDisplayParam(groupsReq.groups);
    }
  }, [dispatch]);

  useEffect(() => {
    if (teachers === null && groups === null) {
      fetchData();
    }
  }, [fetchData, teachers, groups]);

  const search = useCallback(() => {
    if (groups !== null && teachers !== null) {
      let newDisplayParam;

      if (option === "groups") {
        newDisplayParam = groups.filter((group) =>
          group.name.toLowerCase().includes(text.toLowerCase())
        );
      } else {
        newDisplayParam = teachers.filter((teacher) =>
          teacher.name.toLowerCase().includes(text.toLowerCase())
        );
      }

      setDisplayParam(newDisplayParam);
    }
  }, [groups, option, teachers, text]);

  useEffect(() => {
    search();
  }, [search, text, option]);

  const onChangeHandler = (e) => {
    setOption(e);
  };

  const chooseHandler = (id) => {
    let dataToSave = {
      type: option === "groups" ? "group_id" : "teacher_id",
      id,
    };

    localStorage.setItem("userSelect", JSON.stringify(dataToSave));
    dispatch(setSelected(dataToSave));

    toBack();
  };

  return (
    <>
      {groups === null || teachers === null ? (
        <Spinner />
      ) : (
        <>
          <Div className={"DivFixFull"}>
            <SegmentedControl
              onChange={onChangeHandler}
              defaultValue={option}
              options={[
                {
                  label: "Группы",
                  value: "groups",
                  "aria-label": "Группы",
                },
                {
                  label: "Преподаватели",
                  value: "teachers",
                  "aria-label": "Преподаватели",
                },
              ]}
            />
          </Div>

          <Search
            placeholder={"Поиск"}
            value={text}
            after={""}
            className={"mt5"}
            onChange={(e) => setText(e.target.value)}
            maxLength={100}
          />

          {displayParam.map((el) => (
            <SimpleCell
              expandable
              onClick={() => chooseHandler(el.id)}
              key={el.id}
            >
              {el.name}
            </SimpleCell>
          ))}

          {displayParam.length === 0 ? (
            <Placeholder>Ничего не найдено</Placeholder>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
};

export default SelectDisplayParam;
