const initialState = {
  locale:localStorage.locale || "sp",
  token: localStorage.token || "",
  login: localStorage.login || "",
  orders: [],
  tags: [],
  tagsAvailable:[],
  center:false,
  settings: false,
  attributes:{},
  confirm:{
    open:false,
    body:null,
    callback:()=>{}
  },
  errorText:"",
  users:[],
  user:{name:"",roles:[],permissions:[]},
  geoJson: {
    "type": "FeatureCollection",
    "features": [

       ]
  }
}

export function App(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_LOCALE":
      return {
        ...state,
        locale:action.locale
      }
    case "ERROR_TEXT":
      return {
        ...state,
        errorText:action.text
      }
    case "GET_CONFIRM_OPTIONS":
      return {
        ...state,
        confirm:action.confirm
      }
    case "AUTH":
      return {
        ...state,
        token: action.token && action.token,
        login: action.token && action.login
      }
    case "REQUEST_ZONES":
      return {
        ...state,
        geoJson: {...state.geoJson, features: action.zones }
      }
    case "REQUEST_SETTINGS":
      return {
        ...state,
        settings: action.settings
      }
    case "REQUEST_ATTRIBUTES":
      return {
        ...state,
        attributes: action.attributes
      }
    case "SET_MAP_CENTER":
      return {
        ...state,
        center:action.position
      }
    case "CHANGE_TAG":
      return {
        ...state,
        tags:state.tags.map((tag)=>{if(tag.id===action.id){tag[action.valueType]=action.val } return tag})
      }
    case "GET_USERS":
      return {
        ...state,
        users:action.users
      }
    case "USER":
      return {
        ...state,
        user:action.user
      }
    case "ORDERS":
      return {
        ...state,
        orders: action.orders
      }
    case "GET_AVAILABLE_TAGS":
      return {
        ...state,
        tagsAvailable:action.tags
      }      
    case "GET_TAGS":
      return {
        ...state,
        tags: action.tags
      }
    default:
      return state;

  }
}
