import store from '../store.js';
import {handleLogin,setErrorText} from '../actions/actionCreator';
export async function request(url, params={}, parseMethod="json") {
  try {
  	let token = store.getState().App.token;
    let newParams = params;
    newParams = {
      ...params,
      headers: {
        "content-type": "application/json",
        ...params.headers
      }
    }
    if(token){
    	newParams.headers["Authorization"]= token;
    }
    return await fetch(url, newParams).then(res => {
    	if (res.status !== 401) {
    		return res[parseMethod]();
    	}else{
    		store.dispatch(handleLogin(false,""))
        throw new Error("Unauthorized")
    	}
    }).then((res)=>{
      if(res.error){
        store.dispatch(setErrorText(res.message));
        return res;
      }
        return res.response;
    }).catch(err=>null);
  } catch (e) {
    
    return null;
  }
}
