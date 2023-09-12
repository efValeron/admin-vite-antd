import {Button, Col, Form, Input, Pagination, Row, Select, Switch} from "antd";
import {useSearchParams} from "react-router-dom";
import {updateQueryParams} from "../utils/utils.ts";

const columns = [
  {
    value: '_id',
    label: 'ID',
  },
  {
    value: 'code',
    label: 'Код',
  },
  {
    value: 'sort',
    label: 'Sort',
  },
  {
    value: 'name',
    label: 'Название',
  },
  {
    value: 'description',
    label: 'Описание',
  },
  {
    value: 'active',
    label: 'Статус',
  },
  {
    value: 'answerCount',
    label: 'Кол-во ответов',
  },
  {
    value: 'questionCount',
    label: 'Кол-во вопросов',
  }
]
const activeFilterOptions = [
  {value: 'all', label: 'Все'},
  {value: 'active', label: 'Активные'},
  {value: 'disabled', label: 'Неактивные'},
]

export const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeFilter = searchParams.get("filter[active]") !== null ? searchParams.get("filter[active]")! : "all"
  const page = searchParams.get("page") !== null ? Number(searchParams.get("page")!) : 1
  const pageSize = searchParams.get("limit") !== null ? Number(searchParams.get("limit")!) : 10
  const searchValue = searchParams.get("search") !== null ? searchParams.get("search")! : ""
  const advancedSearch = searchParams.get("advancedSearch") !== null ? JSON.parse(searchParams.get("advancedSearch")!) : false
  const total = 214

  // const activeFilterChange = (value: string) => {
  //   updateQueryParams("filter[active]", value, searchParams, setSearchParams)
  // }
  const pageChange = (page: number) => {
    updateQueryParams("page", page.toString(), searchParams, setSearchParams)
  }
  const showSizeChange = (_: number, pageSize: number) => {
    updateQueryParams("limit", pageSize.toString(), searchParams, setSearchParams)
  }
  const onSearch = (values: unknown) => {
    console.log(values)
    // if (value === "") {
    //   updateQueryParams("search", null, searchParams, setSearchParams)
    //   return
    // }
    //
    // updateQueryParams("search", value, searchParams, setSearchParams)
  }
  const toggleAdvancedSearch = (checked: boolean) => {
    updateQueryParams("advancedSearch", checked ? "true" : null, searchParams, setSearchParams)
  }

  return (
    <div className="py-8 min-h-screen flex flex-col justify-center items-center bg-zinc-200 gap-8">
      <div className="w-1/2">
        <Form
          className="w-full"
          layout="vertical"
          onFinish={onSearch}
          initialValues={{
            name: searchValue,
            activeFilter: activeFilter
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

            <Col span={6}>
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
              span={6}
            >
              <Form.Item
                className="m-0"
              >
                <Button
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
              return value !== "name" && value !== "active" ? (
                <Row gutter={32} key={value}>
                  <Col span={12}>
                    <Form.Item
                      label={label}
                      name="_id"
                    >
                      <Input
                        // className="w-2/3"
                        placeholder="Введите id категории для поиска"
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
      <Pagination
        total={total}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        current={page}
        onChange={pageChange}
        onShowSizeChange={showSizeChange}
        pageSize={pageSize}
      />
    </div>
  );
};
