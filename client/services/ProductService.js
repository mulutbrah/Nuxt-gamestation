import myService from '.'
import {getCookieByName} from '@/helpers/cookie'

export default {
  getProducts() {
    return myService.get(`/products`)
  },
  getProduct(id) {
    myService.defaults.headers.common['token'] = getCookieByName('token')

    return myService.get(`/products/${id}`)
  },
  getProductsByCategory(category) {
    return myService.get(`/products/category?category=${category}`)
  },
  searchProduct(productName) {
    return myService.get(`/products/search?q=${productName}`)
  },
  createProduct(payload) {
    myService.defaults.headers.common['token'] = getCookieByName('token')

    return myService.post('/products', payload)
  },
  editProduct(payload) {
    myService.defaults.headers.common['token'] = getCookieByName('token')

    return myService.put(`/products/${payload._id}`, payload)
  },
  removeProduct(id) {
    return myService.delete(`/products/${id}`)
  }
}