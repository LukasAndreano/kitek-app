import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    Card,
    FixedLayout,
    Footer,
    HorizontalScroll,
    Link,
    Placeholder,
    Separator,
    Spinner,
    Tabs,
    TabsItem
} from "@vkontakte/vkui";
import Item from "./__item";
import {useSelector} from "react-redux";
import {getSelected} from "../../storage/selectors/main";
import {
    Icon56GhostOutline,
    Icon56MessagesOutline,
    Icon56Stars3Outline
} from "@vkontakte/icons";
import api from "../../modules/apiRequest";

const Home = ({toModal}) => {
    const [loading, setLoading] = useState(true);

    const [selectedDay, setSelectedDay] = useState(0);
    const [showData, setShowData] = useState(null);

    const selected = useSelector(getSelected);

    const fetchSchedule = useCallback(async () => {
        setLoading(true);
        const req = await api(`schedule?${selected.type}=${selected.id}`);

        if (req.response) {
            setSelectedDay(0);
            setShowData(Object.values(req.schedule));
        }

        setLoading(false);
    }, [selected]);

    useEffect(() => {
        if (selected.type !== null) fetchSchedule();
    }, [selected, fetchSchedule]);

    const onClickHandler = (key) => setSelectedDay(key);

    return (
        <div className={"home"}>
            {selected.type === null ? (
                <>
                    <Placeholder
                        icon={<Icon56Stars3Outline/>}
                        header={"Кажется, тут ничего нет..."}
                        action={
                            <Button onClick={() => toModal("selectDisplayParam")}>
                                Открыть настройки
                            </Button>
                        }
                    >
                        Выберите необходимую группу или преподавателя и страница
                        преобразится!
                    </Placeholder>
                    <Separator/>
                    <Placeholder
                        icon={<Icon56MessagesOutline/>}
                        action={
                            <Button href={"https://vk.com/club63457955"} target={"_blank"}>
                                Перейти в сообщество
                            </Button>
                        }
                    >
                        Присоединяйтесь к нашему{" "}
                        <Link href={"https://vk.com/club63457955"} target={"_blank"}>
                            сообществу
                        </Link>{" "}
                        ВКонтакте и оставайтесь в курсе всех новостей колледжа!
                    </Placeholder>
                </>
            ) : showData === null || loading ? (
                <Placeholder icon={<Spinner/>}>
                    Подождите, мы тут ещё немного поколдуем...
                </Placeholder>
            ) : (
                <>
                    {showData.length !== 0 ? (
                        <>
                            <FixedLayout vertical="top" filled>
                                <Tabs>
                                    <HorizontalScroll
                                        showArrows
                                        getScrollToLeft={(i) => i - 120}
                                        getScrollToRight={(i) => i + 120}
                                    >
                                        {showData.map((el, key) => {
                                            const date = new Date(el.date * 1000)
                                                .toLocaleString("ru", {
                                                    day: "numeric",
                                                    weekday: "long",
                                                    month: "long"
                                                })
                                                .replace(",", " ");

                                            return (
                                                <TabsItem
                                                    key={key}
                                                    onClick={() => onClickHandler(key)}
                                                    selected={selectedDay === key}
                                                >
                                                    {date[0].toUpperCase() + date.slice(1)}
                                                </TabsItem>
                                            );
                                        })}
                                    </HorizontalScroll>
                                </Tabs>
                            </FixedLayout>

                            <div className="fixedLayout--fix panelPadding">
                                {showData[selectedDay].schedule.filter(n => n).map((el, key) => el !== null ?
                                    <Card key={key} className={`scheduleItem mb10`} mode={"tint"}>
                                        {el.map((el2, key2) => (
                                            <Item
                                                key={key2}
                                                type={el2.type}
                                                time={`${el2.number} пара, ${el2.time}`}
                                                showTime={key2 < 1}
                                                name={el2.name}
                                                teacher={el2.teacher ?? el2.group}
                                            />
                                        ))}
                                    </Card> : ""
                                )}
                            </div>

                            <Footer>
                                by{" "}
                                <Link href={"https://vk.com/id172118960"} target={"_blank"}>
                                    @this.state.developer
                                </Link>
                            </Footer>
                        </>
                    ) : (
                        <Placeholder
                            icon={<Icon56GhostOutline/>}
                            header={"Кажись, тут ничего нет"}
                            action={
                                <Button onClick={() => toModal("selectDisplayParam")}>
                                    Открыть настройки
                                </Button>
                            }
                        >
                            Расписание отсутствует или оно ещё не загружено. <br/>
                            <br/>
                            Может, пока сменим группу?
                        </Placeholder>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
