import * as _URL from './url'
import request from './request'
import { AxiosRequestConfig, Method } from 'axios'

function wrap(url: string, method: Method) {
  return (...args: any[]): Promise<any> => {
    let [id, data] = args
    let _url = url.slice()
    if (typeof id === 'string') {
      _url = _url.replace(':id', id)
    } else {
      data = id
    }
    let options: AxiosRequestConfig = {
      url: _url,
      method,
    }
    if (method === 'get') {
      options['params'] = data
    }
    if (method === 'post' || method === 'put') {
      options['data'] = data
    }
    return request(options)
  }
}

export const getArticles = wrap(_URL.article.all, 'get')
export const getOneArticle = wrap(_URL.article.byId, 'get')
export const createArticle = wrap(_URL.article.one, 'post')
export const putArticle = wrap(_URL.article.byId, 'put')
export const deleteArticle = wrap(_URL.article.byId, 'delete')

export const getUsers = wrap(_URL.user.all, 'get')
export const register = wrap(_URL.user.register, 'post')
export const login = wrap(_URL.user.login, 'post')
export const putUser = wrap(_URL.user.byId, 'put')
export const deleteUser = wrap(_URL.user.byId, 'delete')

export const getSchedules = wrap(_URL.schedule.all, 'get')
export const createSchedule = wrap(_URL.schedule.one, 'post')
export const putSchedule = wrap(_URL.schedule.byId, 'put')
export const deleteSchedule = wrap(_URL.schedule.byId, 'delete')

export const getResources = wrap(_URL.resource.all, 'get')
export const createResource = wrap(_URL.resource.one, 'post')
export const putResource = wrap(_URL.resource.byId, 'put')
export const deleteResource = wrap(_URL.resource.byId, 'delete')

export const getProjects = wrap(_URL.project.all, 'get')
export const createProject = wrap(_URL.project.one, 'post')
export const putProject = wrap(_URL.project.byId, 'put')
export const deleteProject = wrap(_URL.project.byId, 'delete')

export const getLogs = wrap(_URL.log.all, 'get')
export const createLog = wrap(_URL.log.one, 'post')
export const putLog = wrap(_URL.log.byId, 'put')
export const deleteLog = wrap(_URL.log.byId, 'delete')

export const getMessages = wrap(_URL.message.all, 'get')
export const createMessage = wrap(_URL.message.one, 'post')
export const putMessage = wrap(_URL.message.byId, 'put')
export const deleteMessage = wrap(_URL.message.byId, 'delete')

export const getDicts = wrap(_URL.dict.all, 'get')
export const getOneDict = wrap(_URL.dict.one, 'get')
export const createDict = wrap(_URL.dict.one, 'post')
export const putDict = wrap(_URL.dict.byId, 'put')
export const delDict = wrap(_URL.dict.byId, 'delete')

export const uploadFile = (
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
) =>
  request({
    url: _URL.upload.largeFile,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress,
  })

export const mergeChunks = wrap(_URL.upload.mergeChunks, 'post')

export const getStates = wrap(_URL.state, 'GET')
