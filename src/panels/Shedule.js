import React, { useState, useEffect, Fragment, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Cell,
  Group,
  Search,
  Spinner,
  Placeholder,
  HorizontalScroll,
  Div,
  Button,
  Card,
  PanelHeader,
  PanelHeaderButton,
} from "@vkontakte/vkui";
import {
  Icon56InfoOutline,
  Icon28SwitchOutlineAlt,
  Icon56FireOutline,
} from "@vkontakte/icons";
import api from "../service/improvedFetch";
import groups from "../data/groups.json";

import { setActiveModal } from "../reducers/mainReducer"
import { setSheduleStore, saveSheduleDay } from "../reducers/sheduleReducer";

export default function Shedule() {
  const [group, setGroup] = useState(null);
  const [sheduleButtons, setSheduleButtons] = useState(null);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [preLoaded, setPreLoaded] = useState(false);
  const [renderButtons, setRenderButtons] = useState(false);

  const [shedule, setShedule] = useState([])

  const storage = useSelector(state => state.main);
  const sheduleStorage = useSelector(state => state.shedule);
  const dispatch = useDispatch();

  // Функция рендера самих пар, использующая локальное хранилище
  const renderLessons = useCallback((data = null) => {
    let i = 1
    let arr = []
    let renderData = sheduleStorage.shedule.length !== 0 ? sheduleStorage.shedule[localStorage.getItem("sheduleDay")].lessons : data[localStorage.getItem("sheduleDay")].lessons
      renderData.forEach(el => {
        i++
        if (el !== "-")
          arr.push(<Card className="tw" key={i} style={{ marginBottom: 10 }}>
          <Div>
            <h4 style={{marginTop: 0, marginBottom: 0}}>
              <span className="hide">Пара №{i}</span>
            </h4>
            {el}
          </Div>
        </Card>)
      })
    setShedule(arr)
  }, [setShedule, sheduleStorage.shedule])

  // Функция, которая рендерит кнопки и потом запускает рендер текста (самого расписания)
  const renderShedule = useCallback(
    (data, fromStorage = false) => {
      let arr = [];
      data.forEach(el => {
        let date = el.date.split(".");
        arr.push(
          <Button
            size="l"
            style={{ marginRight: 8, marginLeft: 2, marginTop: 5, marginBottom: 5 }}
            mode={sheduleStorage.sheduleDay === el.id ? "primary" : "secondary"}
            key={el.id}
            onClick={() => {
              dispatch(saveSheduleDay(el.id))
              localStorage.setItem("sheduleDay", el.id)
              setRenderButtons(true)
            }}
          >
            {new Date(date[2], date[1] - 1, date[0])
              .toLocaleString("ru-RU", { weekday: "long" })[0]
              .toUpperCase() +
              new Date(date[2], date[1] - 1, date[0])
                .toLocaleString("ru-RU", { weekday: "long" })
                .slice(1)}
          </Button>
        );
      });
      setSheduleButtons(arr);
      renderLessons(data)
      dispatch(setSheduleStore(data));
      if (!fromStorage) {
        setTimeout(() => setLoaded(true), 400);
      } else {
        setLoaded(true)
      }
    },
    [dispatch, setSheduleButtons, setLoaded, renderLessons, sheduleStorage.sheduleDay]
  );

  // Общая функция перед запуском рендера кнопок и расписания. Проверяет, есть ли в кеше сохраненные данные.
  const loadShedule = useCallback(
    (group, connectToApi = false) => {
      if (sheduleStorage.shedule.length !== 0 && !connectToApi) {
        renderShedule(sheduleStorage.shedule, true);
      } else {
        api("getShedule", "group=" + group).then((data) => {
          if (data.response !== undefined) {
            renderShedule(data.response.timetable);
          }
        });
      }
    },
    [renderShedule, sheduleStorage.shedule]
  );

  // Устанавливает группу из поиска. После установки очищает локальное хранилище и перезапускает страницу.
  const setGroupFunction = useCallback(
    (id, name) => {
      dispatch(setSheduleStore([]));
      dispatch(saveSheduleDay(0))
      localStorage.setItem("sheduleDay", 0)
      localStorage.setItem("group", JSON.stringify({ id: id, name: name }));
      setGroup({ id: id, name: name });
      loadShedule(id, true);
      setLoaded(false);
      setPreLoaded(false)
    },
    [setGroup, setLoaded, loadShedule, dispatch]
  );

  // Функция рендера объектов в поиске. Прокидываем нужный массив с данными и всё рендерится!
  const renderSearch = useCallback(dataForRender => {
    let arr = []
    dataForRender.forEach(el => {
      arr.push(<Cell onClick={() => setGroupFunction(el.id, el.name)} key={el.id}>
      {el.name}
    </Cell>)
    })
    setList(arr)
  }, [setGroupFunction, setList])

  // Функция поиска. Переводит название группы в lower case, а затем выполняет сравнивание по полученному значению.
  function searchEngine(value) {
    setSearch(value);
    let search = value.toLowerCase();
    let arr = groups.filter(
      ({ name }) => name.toLowerCase().indexOf(search) > -1
    );
    renderSearch(arr)
  }

  useEffect(() => {
    // Вызываем рендер кнопок, чтобы отобразить их новый цвет
    if (renderButtons) {
      setRenderButtons(false)
      renderShedule(sheduleStorage.shedule);
    }
  }, [renderButtons, renderShedule, sheduleStorage.shedule])

  useEffect(() => {
    if (!preLoaded) {
      setPreLoaded(true)
      // Вытаскиваем группу юзера из локального хранилища
      let group = JSON.parse(localStorage.getItem("group"));

      // Проверяем, сохранена ли группа (null - группы в локальном хранилище нет)
      if (group !== null) {
        // Кидаем в стейт все необходимые для последующих процессов данные
        setGroup({ id: group.id, name: group.name });

        // Начинаем рендерить расписание
        loadShedule(group.id);
      } else {
        // Выводим юзеру поиск с выбором группы
        renderSearch(groups)

        // Необходимо, чтобы остановить работу лоадера
        setLoaded(true)
      }
    }
  }, [setLoaded, preLoaded, setPreLoaded, loadShedule, renderSearch])

  return (
    <Fragment>
      <PanelHeader
        left={
          localStorage.getItem("group") !== null ? (
            <PanelHeaderButton
              onClick={() => {
                dispatch(setActiveModal('changeGroup'))
              }}
            >
              <Icon28SwitchOutlineAlt />
            </PanelHeaderButton>
          ) : (
            ""
          )
        }
        separator={storage.isDesktop ? true : false}
      >
        Расписание
      </PanelHeader>
      <Group>
        {loaded ?
          <Fragment>
            {group === null ?
            <Fragment>
            <Placeholder
              style={{ marginBottom: -30, marginTop: -30 }}
              icon={<Icon56InfoOutline />}
              header="Выберите группу"
            >
              Для того, чтобы мы смогли отобразить расписание, необходимо
              выбрать группу.
            </Placeholder>
            <Search
              value={search}
              maxLength="10"
              onChange={(e) => {
                searchEngine(
                  e.target.value
                    .replace(/[A-Za-z^!@#$%^&*()_|/№:?;"'.,<>=-~]/gi, "")
                    .trim()
                );
              }}
            />
            <Div style={{ marginTop: -10 }}>{list}</Div>
          </Fragment> :
            <Fragment>
              <Div>
                <HorizontalScroll
                  showArrows
                  getScrollToLeft={(i) => i - 120}
                  getScrollToRight={(i) => i + 120}
                  style={{ marginBottom: 10 }}
                >
                  <div style={{ display: "flex" }}>{sheduleButtons}</div>
                </HorizontalScroll>

                {shedule.length === 0 ? <Placeholder
                    icon={<Icon56FireOutline />}
                    header="Ура, отдыхаем!"
                  >
                    На этот день нет пар.
                  </Placeholder> :
                    shedule}
              </Div>
            </Fragment>
            }
          </Fragment>
        : <Spinner size="medium" style={{ margin: "20px 0" }} />}
      </Group>
    </Fragment>
  );
}
