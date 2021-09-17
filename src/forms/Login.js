import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Input,
  FormItem,
  FormLayout,
  Placeholder,
  Link,
} from "@vkontakte/vkui";
import { Icon56UserCircleOutline } from "@vkontakte/icons";

import api from "../service/api";
import { setSnackbar, setCurrentForm, setUser } from "../reducers/mainReducer";

export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [blockButton, setBlockButton] = useState(false);

  const [showPasswordError, setShowPasswordError] = useState(false);

  function onChangingPassword(value) {
    setPassword(value);

    if (value.length !== 0 && value.length < 5) setShowPasswordError(true);
    else setShowPasswordError(false);
  }

  function submitForm(e) {
    e.preventDefault();
    if (password.length >= 5 && email.length !== 0) {
      setBlockButton(true);
      api("login", {
        email,
        password,
      }).then((data) => {
        if (data.response) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          dispatch(
            setUser({
              email: "test@test.ru",
            })
          );
          dispatch(
            setUser({
              email: null,
            })
          );
          dispatch(
            setSnackbar({
              text: "Вы успешно вошли в свой аккаунт. С возвращением!",
              success: true,
            })
          );
        } else {
          setBlockButton(false);
          dispatch(
            setSnackbar({
              text: "Аккаунта с таким почтой не существует или Вы ввели неправильный пароль.",
              success: false,
            })
          );
        }
      });
    }
  }

  return (
    <Fragment>
      <Placeholder
        style={{ marginTop: -30, marginBottom: -30 }}
        icon={<Icon56UserCircleOutline />}
        header="С возвращением!"
      >
        Для входа в аккаунт введите свой действующий EMail и пароль, а после
        чего нажмите на кнопку «Войти в аккаунт». Если у Вас еще нет аккаунта,
        то <Link onClick={() => dispatch(setCurrentForm(0))}>создайте</Link> его
        прямо сейчас.
      </Placeholder>
      <FormLayout onSubmit={(e) => submitForm(e)}>
        <FormItem className="mb10" top="Электронная почта">
          <Input
            required
            type="email"
            name="email"
            placeholder="user@gmail.com"
            value={email}
            maxLength={128}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormItem>

        <FormItem
          top="Пароль"
          bottom={
            showPasswordError && "Пароль должен состоять минимум из 5 символов"
          }
          status={showPasswordError && "error"}
          className="mb10"
        >
          <Input
            type="password"
            required
            placeholder="Введите пароль"
            value={password}
            maxLength={128}
            onChange={(e) => {
              onChangingPassword(e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
          <Button
            size="l"
            type="submit"
            stretched
            loading={blockButton}
            disabled={
              setShowPasswordError === true ||
              password.length === 0 ||
              email.length === 0 ||
              blockButton
            }
          >
            Войти в аккаунт
          </Button>
        </FormItem>
      </FormLayout>
    </Fragment>
  );
}
