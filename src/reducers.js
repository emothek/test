const QUERY_KEYWORD = 'QUERY_KEYWORD'
const API_CALL_SUCCESS = 'API_CALL_SUCCESS'
const API_CALL_FAILURE = 'API_CALL_FAILURE'

export const queryKeyword = keyword => ({
    type: QUERY_KEYWORD,
    payload: {
        keyword: keyword
    }
})


const initState = {
    keyword: ''
}

export default function(state=initState, action) {
    switch (action.type) {
        case QUERY_KEYWORD: {
            const { keyword } = action.payload

            return {
                ...state,
                keyword: keyword
            }
        }


        default:
            return state
    }
}