import {Card, Div, Title} from "@vkontakte/vkui";
import {Icon16ClockOutline, Icon16InfoOutline, Icon16UserOutline} from "@vkontakte/icons";

// Пары, для которых не будет действовать пустой блок.
const ignoredLessons = ['Физическая культура']

export default function renderSheduleBlocks(renderData = [], teacherMode = false) {
	// Определяем пустой массив и счётчик для id
	let arr = []
	let id = 0

	// Проходимся по всему массиву данных renderData
	renderData.forEach((el, key) => {
		let group = teacherMode && el.group.split("-");

		group = teacherMode
			? group[1] === undefined
				? group[0]
				: group[1] + "-" + group[0]
			: el["teacher"]

		// +1 к счётчику
		id++;

		// Пушим в массив как раз таки нужные нам блоки, предварительно обработав некоторые данные
		arr.push(
			<Card
				className="tw mb10add"
				key={id}
			>
				<Div>
					<Title level="3" weight="medium">
									<span className="hide">
										Пара №{el.number}
									</span>{" "}
						{el.name}
					</Title>
					<h4 style={{ marginTop: 5, marginLeft: -4, marginBottom: 0 }}>
						<span className="type scheduleSpan inlineFlex"><Icon16InfoOutline className="iconPadding" />{el.type}</span>
						<span className="teacher scheduleSpan inlineFlex">
										<Icon16UserOutline className="iconPadding" />
							{group}
									</span>
						{!teacherMode &&
						<span className="teacher scheduleSpan inlineFlex"
							  style={{marginTop: 'inherit'}}>
										<Icon16ClockOutline className="iconPadding" />
							{el.time}
									</span>
						}
					</h4>
				</Div>
			</Card>
		);
		if (
			renderData[key + 1] !== undefined &&
			renderData[key + 1].number !== el.number &&
			(el.type === "Практика" ||
				renderData[key + 1].type === "Практика") &&
			!ignoredLessons.includes(el.name) &&
			!ignoredLessons.includes(renderData[key + 1].name) &&
			!teacherMode
		)
			arr.push(
				<Card
					key={id + 10}
					style={{ height: 20, marginBottom: 10 }}
				/>
			);
	});

	return arr
}
