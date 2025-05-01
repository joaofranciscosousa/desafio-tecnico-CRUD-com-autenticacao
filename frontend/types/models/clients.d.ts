interface Client {
  id: number
  name: string
  email: string
  phone: string
  born_date: string
}

interface ClientsState {
  loading: boolean
  clients: Client[] | []
  client: Client | undefined
  search: string
  pagination: {
    sortBy: string
    descending: boolean
    page: number
    pages: number
    rowsPerPage: number
    rowsNumber: number
  }
}
