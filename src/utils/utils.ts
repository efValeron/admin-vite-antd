export const updateQueryParams = (key: string, value: string | null, searchParams: URLSearchParams, setSearchParams: (searchParams: URLSearchParams) => void) => {
  if (value === null) searchParams.delete(key)
  else searchParams.set(key, value)

  setSearchParams(searchParams);
}
