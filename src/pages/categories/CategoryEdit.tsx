import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {server_name} from "../../axiosGlobals.ts";
import {Button, Form, Input, InputNumber, notification, Spin, Switch} from "antd";
import {addData, getData, updateData} from "../../utils/utils.ts";
import {CategoryType} from "./Categories.tsx";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {AxiosError, AxiosResponse} from "axios";

export const CategoryEdit = ({add}: {add?: boolean}) => {
  const {id} = useParams()
  const [api, contextHolder] = notification.useNotification()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CategoryType | undefined>(undefined)

  const onUpdateFinish = (values: any) => {
    const url = `${server_name}/api/category/${id}/update`
    updateData(url, {...data, ...values})
      .then((response: AxiosError | AxiosResponse) => {
        if (response.status !== 200) return Promise.reject(response)
        navigate(-1)
        setLoading(false)
      })
      .catch((error: AxiosError) => {
        api["error"]({
          message: "Что-то пошло не так! Повторите попытку позже.",
          description: error.message,
        });
        setLoading(false)
      })
  }

  const onAddFinish = (values: any) => {
    const url = `${server_name}/api/category/`
    addData(url, values)
      .then((response: AxiosError | AxiosResponse) => {
        if (response.status !== 200) return Promise.reject(response)
        navigate(-1)
        setLoading(false)
      })
      .catch((error: AxiosError) => {
        api["error"]({
          message: "Что-то пошло не так! Повторите попытку позже.",
          description: error.message,
        });
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const url = `${server_name}/api/category/${id}`
    getData(url)
      .then((response: { data: CategoryType }) => {
        setData(response.data)
        form.setFieldsValue(response.data)
        setLoading(false)
      })
      .catch((error: Error) => {
        api["error"]({
          message: "Что-то пошло не так! Повторите попытку позже.",
          description: error.message,
        });
        setLoading(false)
      })
  }, []);

  const formItems = <>
    {
      !add &&
      <Form.Item
      label="ID"
      name="_id"
    >
      <Input readOnly/>
    </Form.Item>
    }

    <Form.Item
      label="Название"
      name="name"
      rules={[{required: true, message: 'Это поле не должно быть пустым!'}]}
    >
      <Input/>
    </Form.Item>

    <Form.Item
      label="Описание"
      name="description"
    >
      <Input/>
    </Form.Item>

    <Form.Item
      label="Код"
      name="code"
      rules={[{required: true, message: 'Это поле не должно быть пустым!'}]}
    >
      <Input/>
    </Form.Item>

    <Form.Item
      label="Sort"
      name="sort"
      rules={[{required: true, message: 'Это поле не должно быть пустым!'}]}
    >
      <InputNumber className="w-full"/>
    </Form.Item>

    <Form.Item
      label="Статус"
      name="active"
      valuePropName="checked"
    >
      <Switch/>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Сохранить
      </Button>
    </Form.Item>
  </>

  return (
    <>
      {contextHolder}
      <main className="min-h-screen grid grid-cols-2 bg-zinc-200">
        <section>
          <ArrowLeftOutlined/>

          <Form
            form={form}
            className="m-12 px-16 py-4 bg-zinc-100 rounded-lg"
            name="basic"
            onFinish={add ? onAddFinish : onUpdateFinish}
            autoComplete="off"
            layout="vertical"
          >
            {
              loading
                ? <Spin tip="Пожалуйста подождите...">
                  {formItems}
                </Spin>
                : formItems
            }
          </Form>

        </section>
        <section className="flex flex-col justify-center">
          <div className="py-8 px-4 mx-auto max-w-screen-md text-center lg:py-16 lg:px-12">
            <svg className="mx-auto w-8 h-8 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 512 512">
              <path fill="currentColor"
                    d="M331.8 224.1c28.29 0 54.88 10.99 74.86 30.97l19.59 19.59c40.01-17.74 71.25-53.3 81.62-96.65c5.725-23.92 5.34-47.08 .2148-68.4c-2.613-10.88-16.43-14.51-24.34-6.604l-68.9 68.9h-75.6V97.2l68.9-68.9c7.912-7.912 4.275-21.73-6.604-24.34c-21.32-5.125-44.48-5.51-68.4 .2148c-55.3 13.23-98.39 60.22-107.2 116.4C224.5 128.9 224.2 137 224.3 145l82.78 82.86C315.2 225.1 323.5 224.1 331.8 224.1zM384 278.6c-23.16-23.16-57.57-27.57-85.39-13.9L191.1 158L191.1 95.99l-127.1-95.99L0 63.1l96 127.1l62.04 .0077l106.7 106.6c-13.67 27.82-9.251 62.23 13.91 85.39l117 117.1c14.62 14.5 38.21 14.5 52.71-.0016l52.75-52.75c14.5-14.5 14.5-38.08-.0016-52.71L384 278.6zM227.9 307L168.7 247.9l-148.9 148.9c-26.37 26.37-26.37 69.08 0 95.45C32.96 505.4 50.21 512 67.5 512s34.54-6.592 47.72-19.78l119.1-119.1C225.5 352.3 222.6 329.4 227.9 307zM64 472c-13.25 0-24-10.75-24-24c0-13.26 10.75-24 24-24S88 434.7 88 448C88 461.3 77.25 472 64 472z"/>
            </svg>
            <h1
              className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-2xl xl:text-3xl">В
              процессе разработки</h1>
            <p className="font-light text-gray-500 md:text-md xl:text-lg">Эта часть в данный момент находится в процессе
              разработки.</p>
          </div>
        </section>
      </main>
    </>
  )
    ;
};