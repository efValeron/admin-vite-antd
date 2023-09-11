import {Input, Pagination, Select} from "antd";
import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {SearchProps} from "antd/es/input";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get("filter[active]") !== null ? searchParams.get("filter[active]")! : "all")
  const [page, setPage] = useState(searchParams.get("page") !== null ? Number(searchParams.get("page")!) : 1)
  const [pageSize, setPageSize] = useState(searchParams.get("limit") !== null ? Number(searchParams.get("limit")!) : 10)
  const [searchValue, setSearchValue] = useState(searchParams.get("search") !== null ? searchParams.get("search")! : "")
  const [searchBy, setSearchBy] = useState("_id")
  const total = 214

  const activeFilterChange = (value: string) => {
    setActiveFilter(value)
    searchParams.set("filter[active]", value)
    setSearchParams(searchParams)
  }
  const pageChange = (page: number) => {
    setPage(page)
    searchParams.set("page", page.toString())
    setSearchParams(searchParams)
  }
  const showSizeChange = (_: number, pageSize: number) => {
    setPageSize(pageSize)
    searchParams.set("limit", pageSize.toString())
    setSearchParams(searchParams)
  }
  // const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.currentTarget.value
  //   setSearchValue(value)
  //   searchParams.set("search", value)
  //   setSearchParams(searchParams)
  // }
  const onSearch: SearchProps['onSearch'] = (value, _e, _info) => {
    setSearchValue(value)

    if (value === "") {
      searchParams.delete("search")
      setSearchParams(searchParams)
      return
    }

    searchParams.set("search", value)
    setSearchParams(searchParams)
  }
  const searchByChange = (value: string) => {
    setSearchBy(value)
    console.log(value)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-zinc-200 gap-8">
      <div className="flex gap-4 w-1/2">
        <Input.Search
          defaultValue={searchValue}
          // onChange={onSearchChange}
          onSearch={onSearch}
        />
        <Select
          // className="w-full"
          defaultValue={searchBy}
          onChange={searchByChange}
          options={columns.filter(c => c.value !== "active")}
        />
        <Select
          // className="w-full"
          defaultValue={activeFilter}
          onChange={activeFilterChange}
          options={activeFilterOptions}
        />
      </div>
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
