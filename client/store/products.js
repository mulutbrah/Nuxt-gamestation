import ProductService from '@/services/ProductService'

export const mutations = {
  GET_PRODUCTS(state, events) {
    state.products = events
  },
  ADD_PRODUCT(state, payload) {
    state.products.push(payload)
  },
  REMOVE_PRODUCT(state, id) {
    state.products = state.products.filter(product => product._id !== id)
  }
}

export const actions = {
  async fetchProducts({ commit }) {
    let totalPayment = 0
    commit('SET_LOADING', true)
    try{
      const {data} = await ProductService.getProducts()
      commit('SET_TOTAL_PAYMENT', totalPayment)
      commit('SET_PRODUCTS', data)      
    }catch(err) {
      console.log(err);
      commit('SET_ERROR_MESSAGE', `Failed to add to cart: ${err}`)
    }finally{
      commit('SET_LOADING', false)
    }
  },
  async addProduct({ commit }, payload) {
    // commit('SET_LOADING', true)
    const { name, price, stock, category, detail, picture_url } = payload
    let formData = new FormData()
    
    formData.append('name', name)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('detail', detail)
    
    if(payload.picture_url) {
      formData.append('picture_url', picture_url)
    }
    
    try{
      // commit('SET_LOADING', false)
      const {data} = await ProductService.createProduct(formData)
      commit('ADD_PRODUCT', data)
    }catch(err) {
      console.log(err);
    }finally{
      commit('SET_LOADING', false)
    }
  },
  async editProduct({commit}, payload) {
    commit('SET_LOADING', true)
    try{
      const {data} = await ProductService.editProduct(payload.id, payload)
    }catch(err){
      console.log(err)
    }finally{
      commit('SET_LOADING', false)
    }
  },
  async deleteProduct({ commit }, id) {
    let totalPayment = this.state.user.totalPayment
    commit('SET_LOADING', true)

    try{
      const {data} = await ProductService.removeProduct(id)
      commit('SET_TOTAL_PAYMENT', totalPayment)
      commit('REMOVE_FROM_USER_CARTS', data._id)
      commit('SET_LOADING', false)      
    }catch(err) {
        console.log(err.response);
    }finally{
      commit('SET_LOADING', false)
    }
  }
}