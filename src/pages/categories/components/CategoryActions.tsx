import {Button, message, notification, Popconfirm, Space} from "antd";
import {NavLink} from "react-router-dom";
import {CategoryType} from "../Categories.tsx";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {server_name} from "../../../axiosGlobals.ts";
import {deleteData} from "../../../utils/utils.ts";
import {AxiosError, AxiosResponse} from "axios";

export const CategoryActions = ({row, fetchData}: { row: CategoryType, fetchData: () => void }) => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [messageApi, messageContextHolder] = message.useMessage()

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Категория успешно удалена!',
    })
  }
  const handleDeleteModalOk = async () => {
    const url = `${server_name}/api/category/${row._id}/delete`

    return deleteData(url)
      .then((response: AxiosError | AxiosResponse) => {
        if (response.status !== 200) return Promise.reject(response)
        success()
        fetchData()
      })
      .catch((error: AxiosError) => {
        notificationApi["error"]({
          message: "Что-то пошло не так! Повторите попытку позже.",
          description: error.message,
        })
      })
  }

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
      <Space size="middle">
        <NavLink to={row._id}>Редактировать</NavLink>
        <Popconfirm
          title="Удаление категории"
          description={`Вы уверены что хотите удалить эту категорию? Изменения не могут быть восстановлены!`}
          onConfirm={handleDeleteModalOk}
          icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
          okText="Удалить"
          okButtonProps={{danger: true}}
        >
          <Button type="link" danger>
            Удалить
          </Button>
        </Popconfirm>
      </Space>
    </>
  )
}