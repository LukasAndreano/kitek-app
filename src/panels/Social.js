import React from "react";
import { useSelector } from "react-redux";
import {
  Group,
  Placeholder,
  Button,
  PanelHeader,
  Avatar,
  RichCell,
} from "@vkontakte/vkui";
import { Icon56Users3Outline } from "@vkontakte/icons";

export default function Social() {

  const storage = useSelector(state => state.main);

  return (
    <React.Fragment>
      <PanelHeader separator={storage.isDesktop ? true : false}>
        {storage.isDesktop ? "Социальные сети" : "Соц. сети"}
      </PanelHeader>
      <Group>
        <Placeholder
          header="Социальные сети"
          icon={<Icon56Users3Outline />}
          style={{ marginTop: -30, marginBottom: -30 }}
        >
          На этой странице расположены все социальные сети колледжа с описанием
          контента, который в них публикуется.
        </Placeholder>
        <RichCell
          caption="Официальное сообщество колледжа. Новости, мероприятия, любые вопросы — всё здесь."
          multiline
          disabled
          before={
            <Avatar
              size={48}
              src={""}
              mode="app"
              style={{ backgroundColor: "#0A8DF9" }}
            />
          }
          actions={
            <Button
              className="fixButton2"
              href="https://vk.com/public63457955"
              target="_blank"
            >
              Перейти в сообщество
            </Button>
          }
        >
          <span className="defaultText">ВКонтакте</span>
        </RichCell>
        <RichCell
          caption="Официальная страница колледжа в Instagram. Новости, мероприятия, жизнь колледжа и множество сториз."
          multiline
          disabled
          before={
            <Avatar
              size={48}
              src={""}
              mode="app"
              style={{ backgroundColor: "#FFC150" }}
            />
          }
          actions={
            <Button
              className="fixButton2"
              href="https://www.instagram.com/omskkitec"
              target="_blank"
            >
              Перейти в Instagram
            </Button>
          }
        >
          <span className="defaultText">Instagram</span>
        </RichCell>
        <RichCell
          caption="Официальная страница колледжа в TikTok. Развлекательный контент и видео с мероприятий."
          multiline
          disabled
          before={
            <Avatar
              size={48}
              src={""}
              mode="app"
              style={{ backgroundColor: "#00F7EF" }}
            />
          }
          actions={
            <Button
              className="fixButton2"
              href="https://www.tiktok.com/@omskkitec"
              target="_blank"
            >
              Перейти в TikTok
            </Button>
          }
        >
          <span className="defaultText">TikTok</span>
        </RichCell>
      </Group>
    </React.Fragment>
  );
}
