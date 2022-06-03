import React from "react";
import { Card, Div, Header, Text, Title } from "@vkontakte/vkui";

const Item = ({
  time = "",
  type = "",
  name = "",
  teacher = "",
  showTime = false,
}) => {
  return (
    <Card className={`scheduleItem`} mode={"tint"}>
      <Div>
        <div className="scheduleItem__name">
          <Header
            className={"scheduleItem__name--header"}
            mode="secondary"
            indicator={showTime ? time : ""}
          >
            {type}
          </Header>
          <Title weight={"3"} level={3}>
            {name}
          </Title>
          <Text className={"scheduleItem__item--teacher"} weight={"regular"}>
            {teacher}
          </Text>
        </div>
      </Div>
    </Card>
  );
};

export default Item;
