import React, { useEffect, useState, useCallback } from "react";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Input,
  CustomSelect,
  Placeholder,
  CustomSelectOption,
} from "@vkontakte/vkui";
import { Icon56NotePenOutline } from "@vkontakte/icons";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar, setUser } from "../reducers/mainReducer";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

export default function EditAccountInfo(props) {
  const storage = useSelector((state) => state.main);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [course, setCourse] = useState(0);
  const [group, setGroup] = useState(0);

  const request = useCallback(() => {
    return new Promise((resolve) => {
      authorizedAPI("editProfile", {
        name,
        course,
        group,
      }).then((data) => {
        if (
          data.errorCode !== undefined &&
          (data.errorCode === 3 || data.errorCode === 4)
        )
          refreshToken("editProfile", {
            name,
            course,
            group,
          }).then((data) => {
            return resolve(data);
          });
        else {
          return resolve(data);
        }
      });
    });
  }, [course, group, name]);

  useEffect(() => {
    setGroup(storage.user.group === null ? 0 : storage.user.group);
    setName(storage.user.name === null ? "" : storage.user.name);
    setCourse(storage.user.course);
  }, [storage.user.course, storage.user.name, storage.user.group]);

  return (
    <Group>
      <Placeholder
        icon={<Icon56NotePenOutline />}
        header="Редактирование профиля"
        style={{ marginBottom: -30, marginTop: -30 }}
      >
        Если Вы хотите изменить свои данные, то это можно сделать здесь.
        Обратите внимание, что для работы некоторых функций необходимы реальные
        данные (имя, почта, группа и тд.).
      </Placeholder>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (
            !disabled &&
            name.length >= 5 &&
            name.length < 60 &&
            course !== 0 &&
            group !== 0
          ) {
            setName(name.trim());
            request().then((data) => {
              if (data.response) {
                dispatch(setUser(data.user));
                props.closeModal();
                dispatch(
                  setSnackbar({
                    text: "Данные Вашего аккаунта успешно изменены.",
                    success: true,
                  })
                );
              }
            });
          }
        }}
      >
        <FormItem className="mb10">
          <Input
            placeholder="Имя и фамилия"
            maxLength="60"
            value={name}
            required
            onChange={(e) => {
              setName(
                e.target.value.replace(
                  /[0-9A-Za-z^!@#$%^&*()_|/№:?;"'.,<>=-~]/gi,
                  ""
                )
              );
            }}
          />
        </FormItem>
        <FormItem className="mb10">
          <CustomSelect
            placeholder="Курс на котором Вы сейчас находитесь"
            searchable
            filterFn={(value, option) =>
              option.label.toLowerCase().includes(value.toLowerCase())
            }
            renderOption={({ option, ...restProps }) => (
              <CustomSelectOption {...restProps} />
            )}
            emptyText={"Такого курса нет :/"}
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            options={[
              { value: 1, label: "1 курс" },
              { value: 2, label: "2 курс" },
              { value: 3, label: "3 курс" },
              { value: 4, label: "4 курс" },
            ]}
          />
        </FormItem>
        <FormItem className="mb10">
          <CustomSelect
            placeholder="Группа, в которой Вы обучаетесь"
            searchable
            disabled={course === 0}
            filterFn={(value, option) =>
              option.label.toLowerCase().includes(value.toLowerCase())
            }
            renderOption={({ option, ...restProps }) => (
              <CustomSelectOption {...restProps} />
            )}
            emptyText={"Такой группы нет :/"}
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            options={[{ value: "21-ИСР", label: "21-ИСР" }]}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            type="submit"
            loading={disabled}
            disabled={
              name === "" || name.length < 5 || group === 0 || course === 0
            }
          >
            Сохранить
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
