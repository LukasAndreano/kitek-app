import React from "react";
import {
  ANDROID,
  Group,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  PanelHeaderClose,
} from "@vkontakte/vkui";
import { Icon24Dismiss } from "@vkontakte/icons";
import { useSelector } from "react-redux";
import { getIsDesktop, getPlatform } from "../../storage/selectors/main";

const ModalConstructor = ({ id, close, title = "", children }) => {
  const isDesktop = useSelector(getIsDesktop);
  const platform = useSelector(getPlatform);

  return (
    <ModalPage
      nav={id}
      onClose={close}
      header={
        <ModalPageHeader
          right={
            !isDesktop &&
            platform === IOS && (
              <PanelHeaderButton
                aria-label={"Закрытие модального окна"}
                onClick={close}
              >
                <Icon24Dismiss />
              </PanelHeaderButton>
            )
          }
          left={
            !isDesktop &&
            platform === ANDROID && <PanelHeaderClose onClick={close} />
          }
        >
          {title}
        </ModalPageHeader>
      }
    >
      <Group style={{ height: "100vh" }}>
        <div className={"panelPadding"}>{children}</div>
      </Group>
    </ModalPage>
  );
};

export default ModalConstructor;
