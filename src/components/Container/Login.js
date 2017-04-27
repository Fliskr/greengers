import React, { Component } from 'react';
import { connect} from 'react-redux';
import { handleLogin,setErrorText } from '../../actions/actionCreator';
import getLocaleText from '../../utils/locale';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state={errors:[]}
  }
  async handleSubmit(e) {
    e.preventDefault();
    if(!this.validateLogin(e)){
      return;
    }
    var form = e.target;
    await this.props.handleLogin(form.login.value,form.pass.value)
    if(!this.props.token){
    	form.pass.value=null;
    }
  }

  onChange(e){
  	e.target.value=e.target.value;
  }

  onChangeLogin(e){
    e.target.value=e.target.value.trim().toLowerCase();
  }

  validateLogin(e){
    let errors=[];
    let errorText="";
    var password=e.target.pass.value;
    var login=e.target.login.value;
    if(!password){
      errors.push("pass");
      errorText+="Invalid password. ";
    }
    if(!login){
      errors.push("login");
      errorText+="Invalid login.";
    }

    if(errorText){
      this.props.setErrorText(errorText);
    }
    this.setState({errors});
    return !errors.length;
  }

  render() {
    return (<div className={`loginContainer ${!this.props.show && "show"}`}>
      <form className="loginForm" onSubmit={this.handleSubmit.bind(this)} action="">
				<div className="loginFormInnerContainer">
          <input className="loginFormRow" style={{border:this.state.errors.includes("login")?"1px solid red":"none"}} type="text" name="login" onChange={this.onChangeLogin.bind()} placeholder="Login"/>
          <input className="loginFormRow" style={{border:this.state.errors.includes("pass")?"1px solid red":"none"}} type="password" name="pass" onChange={this.onChange.bind()} placeholder="Password"/>
					<button type="submit">{getLocaleText("enter")}</button>
				</div>
			</form>
			</div>
    )
  }
}

const mapStateToProps=({App})=>{
  return {
    locale:App.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: async (login,password) =>await dispatch(handleLogin(login,password)),
    setErrorText:(text)=>dispatch(setErrorText(text,1500))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
