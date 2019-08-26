import CartService from '@/services/CartService'

export const state = () => ({
  carts: []
})

export const mutations = {
  SET_CARTS(state, carts) {
    state.carts = carts
  },
  ADD_CARTS(state, payload) {
    state.carts.push(payload)
  },
  REMOVE_CARTS(state, id) {
    state.carts = state.carts.filter(cart => cart._id !== id)
  },
  EMPTY_CARTS(state) {
    state.carts = []
  }
}

export const actions = {
  async fetchCarts({ commit }) {
    let totalPayment = 0
    commit('SET_LOADING', true)
    try{
      const {data} = await CartService.getCarts()
      data.forEach(cart => {
        totalPayment+=cart.totalPrice
      })
      commit('SET_TOTAL_PAYMENT', totalPayment)
      commit('SET_CARTS', data)
      
      return data
    }catch(err) {
      console.log(err);
      commit('SET_ERROR_MESSAGE', `Failed to add to cart: ${err}`)
    }finally{
      commit('SET_LOADING', false)
    }
  },
  createCart({ commit }, payload) {
    commit('SET_LOADING', true)

    CartService.addCart(payload)
    .then(({data}) => {
      commit('PUSH_TO_USER_CARTS', data)
      commit('SET_LOADING', false)
    })
    .catch(err=> {
      commit('SET_LOADING', false)
      console.log(err.response);
    })
  },
  async deleteCart({ commit }, id) {
    let totalPayment = this.state.user.totalPayment
    commit('SET_LOADING', true)

    try{
      const {data} = await CartService.delete(`/carts/${id}`)
      totalPayment-=data.totalPrice
      commit('SET_TOTAL_PAYMENT', totalPayment)
      commit('REMOVE_FROM_USER_CARTS', data._id)
      commit('SET_LOADING', false)
      
      return data
    }catch(err) {
        console.log(err.response);
    }finally{
      commit('SET_LOADING', false)
    }
  }
}