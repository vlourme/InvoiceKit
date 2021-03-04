import { MutationTree } from 'vuex'

export const state = () => ({
  drawer: true,
})

export type SidebarModuleState = ReturnType<typeof state>

export const mutations: MutationTree<SidebarModuleState> = {
  SET_DRAWER: (state, drawer) => {
    state.drawer = drawer
  },
}
