export const LoadingReducer = (prevState = { isLoading: false }, action) => {
    const { type, payload } = action
    switch (type) {
        case "change_Loading":
            let newState = { ...prevState }
            newState.isCollapsed = payload
            return newState
        default:
            return prevState
    }

}