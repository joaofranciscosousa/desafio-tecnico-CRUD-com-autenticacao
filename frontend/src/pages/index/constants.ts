import type { QTableColumn } from 'quasar'

export const columns: QTableColumn<UserRow>[] = [
  {
    name: 'name',
    required: true,
    label: 'Nome',
    align: 'left',
    field: (row: { name: string }) => row.name,
    sortable: true,
  },
  {
    name: 'email',
    required: true,
    label: 'E-mail',
    align: 'left',
    field: (row: { email: string }) => row.email,
    sortable: true,
  },
  {
    name: 'phone',
    required: true,
    label: 'Telefone',
    align: 'left',
    field: (row: { phone: string }) => row.phone,
    sortable: true,
  },
  {
    name: 'born_date',
    required: true,
    label: 'Data de nascimento',
    align: 'left',
    field: (row: { born_date: string }) => {
      const date = new Date(row.born_date)

      const formatted = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      return formatted
    },
    classes: 'notranslate',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'left',
    label: 'Ações',
    field: 'actions',
  },
]
