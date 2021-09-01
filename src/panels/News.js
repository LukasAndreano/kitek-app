import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Div, ContentCard, Link, Spinner, PanelHeader } from "@vkontakte/vkui";
import api from "../service/improvedFetch";

import { saveData } from "../reducers/newsReducer";

export default function News() {
  const [wall, setWall] = useState([]);

  const storage = useSelector(state => state.main);
  const newsStorage = useSelector(state => state.news);
  const dispatch = useDispatch();

  useEffect(() => {
    if (newsStorage.data.length !== 0) {
      renderWall(newsStorage.data);
    } else {
      api("getNews").then((data) => {
        if (data.response !== undefined && data.response !== null) {
          renderWall(data.response.items);
          dispatch(saveData(data.response.items));
        }
      });
    }
  }, [newsStorage.data, dispatch]);

  function renderWall(data) {
    let arr = [];
    data.forEach((el) => {
      if (
        el.attachments !== undefined &&
        el.attachments[0].type === "photo"
      ) {
        var image =
          el.attachments[0].photo.sizes[
            el.attachments[0].photo.sizes.length - 1
          ].url;
      } else {
        image = null;
      }
      if (el.text !== "")
        arr.push(
          <Link
            key={el.id}
            href={"https://vk.com/omsktec?w=wall" + el.owner_id + "_" + el.id}
            target="_blank"
            refferer="no-refferer"
          >
            <ContentCard
              className="defaultText tw"
              disabled
              style={{ marginBottom: 10 }}
              text={el.text}
              image={image}
              caption={new Date(el.date * 1000).toLocaleString("ru-RU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </Link>
        );
    });
    setWall(arr);
  }

  return (
    <Fragment>
      <PanelHeader separator={storage.isDesktop ? true : false}>
        Новости
      </PanelHeader>
      {wall.length === 0 ?
        <Spinner size="medium" style={{ margin: "20px 0" }} />
      :
      storage.isDesktop
      ? wall
      : <Div>{wall}</Div>}
    </Fragment>
  );
}
