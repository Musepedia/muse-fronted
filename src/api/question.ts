import { request } from "@/utils/service"

/** 查 */
interface IGetQuestionListApi {
  current: number
  size: number
  museumId: number
  exhibitId?: number
  createTime?: string[]
  updateTime?: string[]
  order?: string
  questionText?: string
  answerType?: number
  answerText?: string
}

interface IGetGPTQuestionListApi {
  current: number
  size: number
  museumId: number
  createTime?: string[]
  updateTime?: string[]
  order?: string
  questionText?: string
  answerText?: string
}

/** 更新 */
interface IUpdateQuestionApi {
  id: number
  exhibitId: number
  answerType: number
  answerText: string
}

/** 提问/问题接口 */
/** 查询/获取问题列表 */
export function getQuestionListApi(params: IGetQuestionListApi) {
  return request({
    url: "question/list",
    method: "get",
    params
  })
}

export function getGPTQuestionListApi(params: IGetGPTQuestionListApi) {
  return request({
    url: "question/list-gpt",
    method: "get",
    params
  })
}

/** 更新问题 */
export function updateQuestionApi(data: IUpdateQuestionApi) {
  return request({
    url: "question",
    method: "put",
    data
  })
}

/** 获取单个提问信息 */
export function getOneQuestionApi(id: number) {
  return request({
    url: `question/${id}`,
    method: "get"
  })
}
