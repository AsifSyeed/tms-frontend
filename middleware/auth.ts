import { isAuthenticatedState } from "~/composables/state"

export default defineNuxtRouteMiddleware((to, from) => {
        if (to.path === '/auth/logout') {
            console.log("inside path if")
            const token = useCookie('userToken')
            token.value = null
            console.log(token)
            const isAuthenticated = isAuthenticatedState()
            isAuthenticated.value = false
            return navigateTo(from)
        }
        if (to.path.includes('/checkout')) {
            const token = useCookie('userToken').value
            console.log(token)
            if (!token) {
                return navigateTo('/auth/signin')
            }
        }
})