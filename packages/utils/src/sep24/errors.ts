import { AxiosResponse } from "axios"
import { TransferServer } from "./transfer-server"

export function ResponseError(
  response: AxiosResponse,
  transferServer: TransferServer
) {
  const isJsonResponse =
    response.headers["content-type"] &&
    /json/.test(response.headers["content-type"])
  const message =
    isJsonResponse &&
    response.data &&
    (response.data.error || response.data.message)
  return Error(
    message
      ? `Request to ${transferServer.domain} failed: ${message}`
      : `Request to ${transferServer.domain} failed with status ${
          response.status
        }`
  )
}
