import React from "react";
import { Group, Panel, PanelHeader } from "@vkontakte/vkui";
import { useSelector } from "react-redux";
import { getIsDesktop } from "../../storage/selectors/main";

const Page = ({ children, id, name = "", left = "" }) => {
  const isDesktop = useSelector(getIsDesktop);

  return (
    <Panel id={id} className={!isDesktop ? "DivFix" : undefined}>
      <PanelHeader left={left} separator={isDesktop}>
        {name}
      </PanelHeader>
      <Group>{children}</Group>
    </Panel>
  );
};

export default Page;
