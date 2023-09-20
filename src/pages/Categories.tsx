import {Button, Col, Form, Input, notification, Pagination, Row, Select, Space, Switch, Table, TableProps} from "antd";
import {NavLink, useSearchParams} from "react-router-dom";
import {generateGetListUrl, getData, updateQueryParams} from "../utils/utils.ts";
import {useEffect, useMemo, useState} from "react";

const activeFilterOptions = [
  {value: 'all', label: 'Все'},
  {value: 'active', label: 'Активные'},
  {value: 'disabled', label: 'Неактивные'},
]

export type CategoryType = {
  _id: string
  code: string
  sort: number
  name: string
  description: string
  active: boolean
  answerCount: number
  questionCount: number
}

export type DataType = {
  data: CategoryType[]
  total: number
}

export const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [api, contextHolder] = notification.useNotification()

  const activeFilter = searchParams.get("filter[active]") === null ? "all" : searchParams.get("filter[active]") === "true" ? "active" : "disabled"
  const page = searchParams.get("page") !== null ? Number(searchParams.get("page")) : 1
  const pageSize = searchParams.get("limit") !== null ? Number(searchParams.get("limit")) : 10
  const searchName = searchParams.get("filter[name]") !== null ? searchParams.get("filter[name]") : ""
  const advancedSearch = searchParams.get("advancedSearch") !== null ? JSON.parse(searchParams.get("advancedSearch")!) : false
  const searchCode = searchParams.get("filter[code]") !== null ? searchParams.get("filter[code]") : ""
  const sortBy = searchParams.get("by")
  const sortOrder = searchParams.get("order") === null ? 1 : Number(searchParams.get("order"))

  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<CategoryType[] | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  // const activeFilterChange = (value: string) => {
  //   updateQueryParams("filter[active]", value, searchParams, setSearchParams)
  // }
  const pageChange = (page: number) => {
    updateQueryParams("page", page.toString(), searchParams, setSearchParams)
  }
  const showSizeChange = (_: number, pageSize: number) => {
    updateQueryParams("limit", pageSize.toString(), searchParams, setSearchParams)
  }
  const onSearch = (values: any) => {
    updateQueryParams("filter[active]", values.activeFilter === "all" ? null : values.activeFilter === "active" ? "true" : "false", searchParams, setSearchParams)
    updateQueryParams("filter[name]", values.name ? values.name : null, searchParams, setSearchParams)

    if (!advancedSearch) return

    updateQueryParams("filter[code]", values.code ? values.code : null, searchParams, setSearchParams)
  }
  const toggleAdvancedSearch = (checked: boolean) => {
    updateQueryParams("advancedSearch", checked ? "true" : null, searchParams, setSearchParams)

    if (!checked) {
      updateQueryParams("filter[code]", null, searchParams, setSearchParams)
    }
  }
  const onSort: TableProps<CategoryType>['onChange'] = (_, __, sorter) => {
    updateQueryParams("by", sorter.order === undefined ? null : sorter.field, searchParams, setSearchParams)
    updateQueryParams("order", sorter.order === undefined ? null : sorter.order === "ascend" ? "1" : "-1", searchParams, setSearchParams)
  };

  useEffect(() => {
    setLoading(true)
    const url = generateGetListUrl(window.location.href, "category")
    getData(url)
      .then((response: DataType) => {
        setTotal(response.total)
        setCategories(response.data)
        setLoading(false)
      })
      .catch((error: Error) => {
        api["error"]({
          message: "Что-то пошло не так!",
          description: "Попробуйте еще раз или повторите попытку позже." + error.message,
        });
        setLoading(false)
      })
  }, [searchParams]);

  const columns = [
    {
      value: '_id',
      label: 'ID',
      dataIndex: '_id',
      key: '_id',
      title: 'ID',
    },
    {
      value: 'code',
      label: 'Код',
      dataIndex: 'code',
      key: 'code',
      title: 'Код',
      sorter: true,
      defaultSortOrder: sortBy === "code" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      value: 'sort',
      label: 'Sort',
      dataIndex: 'sort',
      key: 'sort',
      title: 'Sort',
      sorter: true,
      defaultSortOrder: sortBy === "sort" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      value: 'name',
      label: 'Название',
      dataIndex: 'name',
      key: 'name',
      title: 'Название',
      sorter: true,
      defaultSortOrder: sortBy === "name" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      value: 'description',
      label: 'Описание',
      dataIndex: 'description',
      key: 'description',
      title: 'Описание',
    },
    {
      value: 'active',
      label: 'Статус',
      dataIndex: 'active',
      key: 'active',
      title: 'Статус',
      render: (active: boolean) => {
        return active ? "Активный" : "Неактивный"
      },
      sorter: true,
      defaultSortOrder: sortBy === "active" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      value: 'answerCount',
      label: 'Кол-во ответов',
      dataIndex: 'answerCount',
      key: 'answerCount',
      title: 'Кол-во ответов',
      sorter: true,
      defaultSortOrder: sortBy === "answerCount" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      value: 'questionCount',
      label: 'Кол-во вопросов',
      dataIndex: 'questionCount',
      key: 'questionCount',
      title: 'Кол-во вопросов',
      sorter: true,
      defaultSortOrder: sortBy === "questionCount" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      value: 'action',
      label: 'Действия',
      dataIndex: 'action',
      title: 'Действия',
      key: 'action',
      render: (_: any, row: CategoryType) => (<Space size="middle">
          <NavLink to={row._id}>Редактировать</NavLink>
          <a>Удалить</a>
        </Space>
      ),
    },
  ]

  const pagination = useMemo(() => <Pagination
    className="flex justify-end"
    total={total}
    showSizeChanger
    showQuickJumper
    showTotal={(total) => `Total ${total} items`}
    current={page}
    onChange={pageChange}
    onShowSizeChange={showSizeChange}
    pageSize={pageSize}
  />, [page, pageSize, total])
  const search = useMemo(() => <>
    <div className="w-1/2 flex justify-center">
      <Form
        className="w-full"
        layout="vertical"
        onFinish={onSearch}
        initialValues={{
          name: searchName,
          activeFilter: activeFilter,
          code: searchCode
        }}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item label="Название" name="name">
              <Input
                placeholder="Введите название категории для поиска"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Активность" name="activeFilter">
              <Select
                // className="w-full"
                // onChange={activeFilterChange}
                options={activeFilterOptions}
              />
            </Form.Item>
          </Col>

          <Col
            className="flex items-center"
            span={4}
          >
            <Form.Item
              className="m-0 w-full"
            >
              <Button
                className="w-full"
                type="primary"
                htmlType="submit"
              >
                Поиск
              </Button>
            </Form.Item>
          </Col>
        </Row>

        {
          advancedSearch &&
          columns.map(({value, label}) => {
            return value === "code" ? (
              <Row gutter={32} key={value}>
                <Col span={12}>
                  <Form.Item
                    label={label}
                    name={value}
                  >
                    <Input
                      // className="w-2/3"
                      placeholder={`Введите ${label} категории для поиска`}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : null
          })
        }


      </Form>
    </div>
    <Switch defaultChecked={advancedSearch} onChange={toggleAdvancedSearch}/>
  </>, [advancedSearch, searchName, searchCode, activeFilter, advancedSearch])

  return (
    <>
      {contextHolder}
      <div className="py-8 min-h-screen flex flex-col items-center bg-zinc-200 gap-8">
        {search}

        <Table
          loading={loading}
          className="w-full px-32"
          dataSource={categories}
          columns={columns}
          pagination={false}
          footer={() => pagination}
          onChange={onSort}
        />
      </div>
    </>
  )
}
