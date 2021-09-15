import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  ModalCard,
  ModalRoot,
  Button,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
} from "@vkontakte/vkui";

import { useHistory } from "react-router-dom";

import { Icon56InfoOutline, Icon24Dismiss } from "@vkontakte/icons";

import { setActiveModal, setUser } from "../reducers/mainReducer";
import { saveSheduleDay, setSheduleStore } from "../reducers/sheduleReducer";

import EditAccountInfo from "./EditAccountInfo";

export default function Modals() {
  const [blockBackButton, setBlockBackButton] = useState(false);

  const storage = useSelector((state) => state.main);
  const dispatch = useDispatch();

  const history = useHistory();

  const pushToHistory = useCallback(
    (activeModal) => {
      history.push(window.location.pathname + "#" + activeModal);
    },
    [history]
  );

  const closeModal = useCallback(() => {
    if (!blockBackButton) {
      setBlockBackButton(true);
      history.goBack();
      dispatch(setActiveModal(null));
      setTimeout(() => setBlockBackButton(false), 50);
    }
  }, [history, dispatch, blockBackButton]);

  useEffect(() => {
    if (storage.activeModal !== null) pushToHistory(storage.activeModal);
  }, [pushToHistory, storage.activeModal]);

  return (
    <ModalRoot activeModal={storage.activeModal}>
      <ModalCard
        id="changeGroup"
        onClose={() => {
          closeModal();
        }}
        icon={<Icon56InfoOutline />}
        header="Вы уверены, что хотите сменить группу?"
        subheader={
          "При смене группы из кеша удаляется расписание, а также привязка к группе."
        }
        actions={
          <Button
            size="l"
            mode="primary"
            onClick={() => {
              closeModal();
              localStorage.removeItem("group");
              dispatch(saveSheduleDay(0));
              dispatch(setSheduleStore([]));
              setTimeout(() => {
                history.push(window.location.pathname + "r");
                history.goBack();
              }, 100);
            }}
          >
            Да, сменить
          </Button>
        }
      />

      <ModalCard
        id="logout"
        onClose={() => {
          closeModal();
        }}
        icon={<Icon56InfoOutline />}
        header="Выйти из аккаунта?"
        subheader={
          "После выхода из аккаунта для доступа к некоторым функциям понадобится авторизация."
        }
        actions={
          <Button
            size="l"
            mode="primary"
            onClick={() => {
              closeModal();
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              dispatch(
                setUser({
                  name: null,
                  email: null,
                  course: 0,
                  group: null,
                  status: 0,
                })
              );
            }}
          >
            Да, выйти
          </Button>
        }
      />

      <ModalPage
        id="editAccountInfo"
        onClose={() => {
          closeModal();
        }}
        dynamicContentHeight
        header={
          <ModalPageHeader
            right={
              storage.isDesktop ? (
                ""
              ) : (
                <PanelHeaderButton onClick={() => closeModal()}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
            separator={false}
          >
            Редактирование
          </ModalPageHeader>
        }
      >
        <EditAccountInfo closeModal={closeModal} />
      </ModalPage>
    </ModalRoot>
  );
}
