import UserService from '@/services/UserService';
import AuthService from '~/services/AuthService';
import {getCookieByName} from '@/helpers/cookie'
import {clearCookie} from '~/helpers/cookie'
import {SET_LOADING} from '.'

export const state = () => ({
  user: {
    id:'',
    name:'',
    email: '',
    role: '',
    address: null,
    phone: null,
    totalPayment: 0
  },
  isLoggedIn: false,
  isAdministrator: false,
  token: ''
})

export const getters = {
  getUser: state => {
    return state.user
  },
  getUserRole: state => {
    return state.user.role
  },
  cartLength: state => {
    return state.carts ? state.carts.length : 0
  },
  isAdministrator: state => {
    return state.user.role === 'administrator'
  },
  getIsLoggedIn: state => {
    return state.isLoggedIn
  },
  getLoading: state => {
    return state.loading
  }
}

export const mutations = {
  SET_DEFAULT_STATE(state) {
    state.user={
      id:'',
      name:'',
      email: '',
      role: '',
      address: null,
      phone: null,
      totalPayment: 0
    }
  },
  SET_IS_LOGGED_IN(state, payload) {
    state.isLoggedIn = payload
  },
  SET_IS_ADMINISTRATOR(state, isAdmin) {
    state.isAdministrator = isAdmin
  },
  SET_USER_DATA(state, payload) {
    if(payload) {
      state.user=payload
      state.isLoggedIn=true

      if(payload.role==='administrator') {
        state.isAdministrator = true
      }else{
        state.isAdministrator = false
      }
    }else{
      state.user = {}
    }
  },
  SET_LOADING
}

export const actions = {
  async login({commit}, payload) {
    commit('SET_LOADING', true)
    try{
      const {data} = await AuthService.login(payload)

      if(payload==='administrator') {
        commit("SET_IS_ADMINISTRATOR", true)
      }else{
        commit("SET_IS_ADMINISTRATOR", false)
      }
      commit('SET_IS_LOGGED_IN', true)
      commit('SET_USER_DATA', data)

      return data
    }catch(err){
      console.log(err)
    }finally{
      commit('SET_LOADING', false)      
    }
  },
  logout({commit}){
    Swal.fire(
      `Logout`,
      'see you around :)',
      'success'
    )
    clearCookie()
    commit('SET_IS_LOGGED_IN', false)
    commit("SET_IS_ADMINISTRATOR", false)
    commit("SET_DEFAULT_STATE", false)
    this.$router.push('/')
  },
  async fetchUserData({ commit }) {
    const id = getCookieByName('id')

    // commit('SET_LOADING', true)
    if(id) {
      try{
        const {data} = await UserService.getUserData(id)
        commit("SET_USER_DATA", data)
      }catch(err){
        console.log(err);
        if(err.response.data.message === 'jwt expired') {
          commit('SET_LOADING', false)
          commit('SET_DEFAULT_STATE')
          localStorage.clear()
          this.$router.push('/')
        }
      }finally{
        commit('SET_LOADING', false)
      }
    }else{
      console.log('Cannot get id');
    }
  },
  async updateUserData({commit}, payload) {
    const userId = getCookieByName('id')
    if(userId) {
      try{
        const {data} = await UserService.updateUser(payload, userId)
        commit("SET_USER_DATA", data)
      }catch(err){
        console.log(err)
        if(err.response.data.message === 'jwt expired') {
          commit('SET_DEFAULT_STATE')
          localStorage.clear()
          this.$router.push('/')
        }
      }finally{
        commit('SET_LOADING', false)
      }
    }
  }
}