import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = ({ store, redirect }) => {
  if (!store.state.auth) {
    redirect('/auth/login')
  }
}

export default authMiddleware
