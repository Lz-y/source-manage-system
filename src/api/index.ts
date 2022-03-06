import * as URL from './url'
import request from './request'
import {AxiosRequestConfig, Method} from 'axios'

function wrap (url: string, method: Method) {
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
      method
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

export const getArticles = wrap(URL.article.all, 'get')
export const getOneArticle = wrap(URL.article.byId, 'get')
export const createArticle = wrap(URL.article.one, 'post')
export const putArticle = wrap(URL.article.byId, 'put')
export const deleteArticle = wrap(URL.article.byId, 'delete')

export const getUsers = wrap(URL.user.all, 'get')
export const register = wrap(URL.user.register, 'post')
export const login = wrap(URL.user.login, 'post')
export const putUser = wrap(URL.user.byId, 'put')
export const deleteUser = wrap(URL.user.byId, 'delete')

export const getSchedules = wrap(URL.schedule.all,'get')
export const createSchedule = wrap(URL.schedule.one, 'post')
export const putSchedule = wrap(URL.schedule.byId, 'put')
export const deleteSchedule = wrap(URL.schedule.byId, 'delete')

export const getResources = wrap(URL.resource.all,'get')
export const createResource = wrap(URL.resource.one, 'post')
export const putResource = wrap(URL.resource.byId, 'put')
export const deleteResource = wrap(URL.resource.byId, 'delete')

export const getProjects = wrap(URL.project.all,'get')
export const createProject = wrap(URL.project.one, 'post')
export const putProject = wrap(URL.project.byId, 'put')
export const deleteProject = wrap(URL.project.byId, 'delete')

export const getLogs = wrap(URL.log.all,'get')
export const createLog = wrap(URL.log.one, 'post')
export const putLog = wrap(URL.log.byId, 'put')
export const deleteLog = wrap(URL.log.byId, 'delete')

export const getMessages = wrap(URL.message.all,'get')
export const createMessage = wrap(URL.message.one, 'post')
export const putMessage = wrap(URL.message.byId, 'put')
export const deleteMessage = wrap(URL.message.byId, 'delete')

export const getDicts = wrap(URL.dict.all,'get')
export const createDict = wrap(URL.dict.one, 'post')
export const putDict = wrap(URL.dict.byId, 'put')
export const deleteDict = wrap(URL.dict.byId, 'delete')