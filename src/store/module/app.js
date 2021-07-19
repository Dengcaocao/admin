import {
  getBreadCrumbList,
  getMenuByRouter,
  getHomeRoute,
  localSave,
  localRead
} from '@/libs/util'
// getTagNavListFromLocalstorage,getNextRoute,routeHasExist,routeEqual,getRouteTitleHandled,
// import beforeClose from '@/router/before-close'
import { saveErrorLogger } from '@/api/data'
// import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

export default {
  state: {
    breadCrumbList: [],
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    }
  }
}
