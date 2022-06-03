import React from "react";
import { ModalRoot } from "@vkontakte/vkui";
import ModalConstructor from "./__constructor";
import SelectDisplayParam from "./selectDisplayParam";

const Modals = ({ router, toBack }) => {
  return (
    <ModalRoot activeModal={router.modal} onClose={toBack}>
      <ModalConstructor
        id="selectDisplayParam"
        title="Настройки"
        close={toBack}
      >
        <SelectDisplayParam toBack={toBack} />
      </ModalConstructor>
    </ModalRoot>
  );
};

export default Modals;
