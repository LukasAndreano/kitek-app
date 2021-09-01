import React, { useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux";

import {
    ModalCard,
    ModalRoot,
    Button,
} from "@vkontakte/vkui"

import {
    useHistory,
  } from "react-router-dom";

import {
    Icon56InfoOutline,
} from "@vkontakte/icons"

import { setActiveModal } from "../reducers/mainReducer"
import { saveSheduleDay, setSheduleStore } from "../reducers/sheduleReducer"

export default function Modals() {

    const storage = useSelector(state => state.main);
    const dispatch = useDispatch();

    const history = useHistory()

    const pushToHistory = useCallback((activeModal) => {
        history.push(window.location.pathname + "#" + activeModal);
    }, [history])

    const closeModal = useCallback(() => {
        history.goBack()
        dispatch(setActiveModal(null));
    }, [history, dispatch])

    useEffect(() => {
        if (storage.activeModal !== null)
            pushToHistory(storage.activeModal)
    }, [pushToHistory, storage.activeModal])

    return (
        <ModalRoot activeModal={storage.activeModal}>

        <ModalCard
          id="changeGroup"
          onClose={() => {
            closeModal()
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
                closeModal()
                localStorage.removeItem("group");
                dispatch(saveSheduleDay(0));
                dispatch(setSheduleStore([]));
                setTimeout(() => {
                    history.push(window.location.pathname + "r");
                    history.goBack()
                }, 100)
              }}
            >
              Да, сменить
            </Button>
          }
        />

        </ModalRoot>
    )
}
