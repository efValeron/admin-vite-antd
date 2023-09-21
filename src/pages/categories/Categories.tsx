import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Pagination,
  Row,
  Select,
  Switch,
  Table,
  TableProps
} from "antd";
import {NavLink, useSearchParams} from "react-router-dom";
import {generateGetListUrl, getData, updateQueryParams} from "../../utils/utils.ts";
import {useEffect, useMemo, useState} from "react";
import {CategoryActions} from "./components/CategoryActions.tsx";
import {AxiosError} from "axios";
import {ColumnGroupType, ColumnType} from "antd/es/table";

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

  const fetchData = () => {
    setLoading(true)
    const url = generateGetListUrl(window.location.href, "category")
    getData(url)
      .then((response: DataType) => {
        setTotal(response.total)
        setCategories(response.data)
        setLoading(false)
      })
      .catch((error: AxiosError) => {
        api["error"]({
          message: "Что-то пошло не так!",
          description: "Попробуйте еще раз или повторите попытку позже. " + error.message,
        });
        setLoading(false)
      })
  }
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
    // @ts-ignore
    updateQueryParams("by", sorter.order === undefined ? null : sorter.field, searchParams, setSearchParams)
    // @ts-ignore
    updateQueryParams("order", sorter.order === undefined ? null : sorter.order === "ascend" ? "1" : "-1", searchParams, setSearchParams)
  };

  useEffect(() => {
    fetchData()
  }, [activeFilter, page, pageSize, searchName, searchCode, sortBy, sortOrder])

  const columns: (ColumnType<CategoryType> | ColumnGroupType<CategoryType>)[] = [
    {
      dataIndex: '_id',
      key: '_id',
      title: 'ID',
    },
    {
      dataIndex: 'code',
      key: 'code',
      title: 'Код',
      sorter: true,
      defaultSortOrder: sortBy === "code" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      dataIndex: 'sort',
      key: 'sort',
      title: 'Sort',
      sorter: true,
      defaultSortOrder: sortBy === "sort" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Название',
      sorter: true,
      defaultSortOrder: sortBy === "name" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: 'Описание',
    },
    {
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
      dataIndex: 'answerCount',
      key: 'answerCount',
      title: 'Кол-во ответов',
      sorter: true,
      defaultSortOrder: sortBy === "answerCount" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      dataIndex: 'questionCount',
      key: 'questionCount',
      title: 'Кол-во вопросов',
      sorter: true,
      defaultSortOrder: sortBy === "questionCount" ? sortOrder === 1 ? "ascend" : "descend" : null,
    },
    {
      dataIndex: 'action',
      title: 'Действия',
      key: 'action',
      render: (_: any, row: CategoryType) => <CategoryActions row={row} fetchData={fetchData}/>
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
    <div className="flex justify-center">
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
          columns.map(({key, title}) => {
            return key === "code" ? (
              <Row gutter={32} key={key}>
                <Col span={12}>
                  <Form.Item
                    label={title as string}
                    name={key}
                  >
                    <Input
                      // className="w-2/3"
                      placeholder={`Введите ${title} категории для поиска`}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : null
          })
        }


      </Form>
    </div>
  </>, [advancedSearch, searchName, searchCode, activeFilter, advancedSearch])
  const tableHeader = <div className="px-48 flex justify-between">
    <div className="w-1/2">
      {search}
    </div>
    <div className="flex flex-row items-center gap-2">
      <h6 className="m-0 text-base font-semibold ">Расширенный поиск:</h6>
      <Switch defaultChecked={advancedSearch} onChange={toggleAdvancedSearch}/>
    </div>
    <div className="flex flex-col justify-center">
      <NavLink to="add">
        <Button type="primary">
          Добавить
        </Button>
      </NavLink>
    </div>
  </div>

  return (
    <>
      {contextHolder}
      <div className="py-8 px-8 min-h-screen flex flex-col items-center bg-zinc-200 gap-8">
        <Table
          loading={loading}
          className="w-full px-32"
          dataSource={categories}
          columns={columns}
          pagination={false}
          footer={() => pagination}
          onChange={onSort}
          title={() => tableHeader}
        />
      </div>
    </>
  )
}
