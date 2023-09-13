import {Button, Col, Form, Input, Pagination, Row, Select, Switch, Table} from "antd";
import {useSearchParams} from "react-router-dom";
import {generateGetUrl, getCategories, updateQueryParams} from "../utils/utils.ts";
import {useEffect, useMemo, useState} from "react";

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
    // sorter: (a: string, b: string) => console.log(a, b),
  },
  {
    value: 'sort',
    label: 'Sort',
    dataIndex: 'sort',
    key: 'sort',
    title: 'Sort',
    // sorter: (a: number, b: number) => console.log(a, b),
  },
  {
    value: 'name',
    label: 'Название',
    dataIndex: 'name',
    key: 'name',
    title: 'Название',
    // sorter: (a: string, b: string) => console.log(a, b),
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
    // sorter: (a: boolean, b: boolean) => console.log(a, b),
  },
  {
    value: 'answerCount',
    label: 'Кол-во ответов',
    dataIndex: 'answerCount',
    key: 'answerCount',
    title: 'Кол-во ответов',
    // sorter: (a: number, b: number) => console.log(a, b),
  },
  {
    value: 'questionCount',
    label: 'Кол-во вопросов',
    dataIndex: 'questionCount',
    key: 'questionCount',
    title: 'Кол-во вопросов',
    // sorter: (a) => console.log(a)
  }
]
const activeFilterOptions = [
  {value: 'all', label: 'Все'},
  {value: 'active', label: 'Активные'},
  {value: 'disabled', label: 'Неактивные'},
]

export const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeFilter = searchParams.get("filter[active]") === null ? "all" : searchParams.get("filter[active]") === "true" ? "active" : "disabled"
  const page = searchParams.get("page") !== null ? Number(searchParams.get("page")!) : 1
  const pageSize = searchParams.get("limit") !== null ? Number(searchParams.get("limit")!) : 10
  const searchName = searchParams.get("filter[name]") !== null ? searchParams.get("filter[name]")! : ""
  const advancedSearch = searchParams.get("advancedSearch") !== null ? JSON.parse(searchParams.get("advancedSearch")!) : false
  const searchCode = searchParams.get("filter[code]") !== null ? searchParams.get("filter[code]")! : ""
  let [total, setTotal] = useState(0)
  let [categories, setCategories] = useState([])
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

    if (advancedSearch) return

    updateQueryParams("filter[code]", values.code ? values.code : null, searchParams, setSearchParams)
  }
  const toggleAdvancedSearch = (checked: boolean) => {
    updateQueryParams("advancedSearch", checked ? "true" : null, searchParams, setSearchParams)

    if (!checked) {
      updateQueryParams("filter[code]", null, searchParams, setSearchParams)
    }
  }

  useEffect(() => {
    setLoading(true)
    const url = generateGetUrl(window.location.href, "category")
    console.log("fetching")
    getCategories(url)
      .then(response => {
        setTotal(response.total)
        setCategories(response.data)
        setLoading(false)
      })
  }, [searchParams]);

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
  />, [page, pageSize, total]);

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


  console.log(total, categories)
  return (
    <div className="py-8 min-h-screen flex flex-col items-center bg-zinc-200 gap-8">
      {search}

      <Table
        loading={loading}
        className="w-full px-32"
        dataSource={categories}
        columns={columns}
        pagination={false}
        footer={() => pagination}
      />
    </div>
  )
}
