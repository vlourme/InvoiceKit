import { GetterTree } from 'vuex'
import { RootState } from './root'

const getters: GetterTree<RootState, RootState> = {
  isLoggedIn: (state) => state.auth !== null,
}

export default getters
