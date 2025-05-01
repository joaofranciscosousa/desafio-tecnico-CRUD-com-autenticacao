import { Notify } from 'quasar'

const validateErrorMessage = (error: {
  response: {
    status: number
    data: {
      map: (arg0: (err: { message: string; attribute: string }) => void) => void
      message: string
    }
  }
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = {}
  if (error.response.status == 422) {
    error.response.data.map((err: { message: string; attribute: string }) => {
      messages[err.attribute] = err.message
    })
  } else {
    Notify.create({
      type: 'negative',
      message: error.response.data.message,
    })
  }
  return messages
}

export { validateErrorMessage }
