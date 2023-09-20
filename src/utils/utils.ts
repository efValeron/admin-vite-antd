import {axiosHeaders, server_name} from "../axiosGlobals.ts";
import axios from "axios";
import {CategoryType} from "../pages/Categories.tsx";

export const updateQueryParams = (key: string, value: string | null, searchParams: URLSearchParams, setSearchParams: (searchParams: URLSearchParams) => void) => {
  if (value === null) searchParams.delete(key)
  else searchParams.set(key, value)

  setSearchParams(searchParams);
}

export const generateGetListUrl = (url: string, type: string) => {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;

  if (searchParams.has('advancedSearch')) {
    searchParams.delete('advancedSearch');
  }

  // Добавляем limit и page если параметров нет
  if (!searchParams.keys().next().value) {
    searchParams.append('limit', '10');
    searchParams.append('page', '1');
  }

  return `${server_name}/api/${type}?${searchParams.toString()}`;
}

export const getData = async (url: string) => {
  try {
    const response = await axios.get(url, {headers: axiosHeaders})
    return response.data
  } catch (error) {
    // @ts-ignore
    throw new Error(error.message)
  }
}

type UpdateDataType = CategoryType

export const updateData = async (url: string, data: UpdateDataType) => {
  try {
    return await axios.post(url, data, {headers: axiosHeaders})
  } catch (error) {
    // @ts-ignore
    throw new Error(error.message)
  }
}