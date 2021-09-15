import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Group, Placeholder, PanelHeader, RichCell } from "@vkontakte/vkui";
import {
  Icon56DownloadSquareOutline,
  Icon28DownloadCloudOutline,
} from "@vkontakte/icons";

export default function Time() {
  const storage = useSelector((state) => state.main);

  return (
    <Fragment>
      <PanelHeader separator={storage.isDesktop ? true : false}>
        {storage.isDesktop ? "Загрузка приложения" : "Приложение"}
      </PanelHeader>
      <Group>
        <Placeholder
          header="Загрузка приложения"
          icon={<Icon56DownloadSquareOutline />}
          style={{ marginTop: -30, marginBottom: -30 }}
        >
          Загрузите приложение КИТЭК'а и просматривайте расписание и новости еще
          быстрее!
        </Placeholder>
        <RichCell
          multiline
          caption="Windows 10 и выше (Microsoft Store)"
          href="https://www.microsoft.com/ru-ru/p/%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BA%D0%B8%D1%82%D1%8D%D0%BA/9pnf3jwf9lcj?activetab=pivot:overviewtab"
          target="_blank"
          after={<Icon28DownloadCloudOutline />}
        >
          <span className="defaultText">Приложение для Windows</span>
        </RichCell>
        <RichCell
          multiline
          caption="Windows 10 и выше (Установщик)"
          href="https://api.omsktec.ru/downloads/win-latest.exe"
          target="_blank"
          after={<Icon28DownloadCloudOutline />}
        >
          <span className="defaultText">Приложение для Windows</span>
        </RichCell>
        <RichCell
          multiline
          caption="Установщик (.apk)"
          href="https://api.omsktec.ru/downloads/android-latest.apk"
          target="_blank"
          after={<Icon28DownloadCloudOutline />}
        >
          <span className="defaultText">Приложение для Android</span>
        </RichCell>
        <RichCell
          multiline
          caption="Google Play"
          disabled
          after={<Icon28DownloadCloudOutline fill="#f2f2f2" />}
        >
          Приложение для Android (скоро)
        </RichCell>
        <RichCell
          multiline
          caption="App Store"
          disabled
          after={<Icon28DownloadCloudOutline fill="#f2f2f2" />}
        >
          Приложение для iOS (скоро)
        </RichCell>
      </Group>
    </Fragment>
  );
}
