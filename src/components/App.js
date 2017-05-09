import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import NavMenu from './Presentational/NavMenu';
import Confirm from './Presentational/Confirm';
import PopupError from './Presentational/PopupError';
import Dropdown from './Presentational/Dropdown';
import Login from './Container/Login';
import {request} from '../utils/request';
import getLocaleText from '../utils/locale';
import { handleLogin,getCurrentUser,getConfirmModal,setErrorText,changeLocale } from '../actions/actionCreator';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      scrolled:false,
    }
  }

  componentDidMount() {
    this.props.token && this.props.getCurrentUser();
    this.onScroll=window.addEventListener('scroll',this.onWindowScroll.bind(this),false);
  }

  onWindowScroll(e){
    let changeColor=document.body.scrollTop>20;
    if(this.state.scrolled!==changeColor){
      this.setState({scrolled:changeColor});
    }
    // let header =  document.getElementById('mainHeader').style;
    // "scrolledHeader";
    // header.backgroundColor=changeColor?"white":"transparent";
    // header.color=changeColor?"#000":"#fff";
    // let logo=document.getElementById('mainLogo').style;
    // "scrolledLogo";

  }
    // header.backgroundColor=changeColor?"white":"transparent";
    // header.color=changeColor?"#000":"#fff";
    // let logo=document.getElementById('mainLogo').style;
    // "scrolledLogo";
  componentWillUnmount(){
    window.removeEventListener('scroll',this.onWindowScroll);
  }

 async componentWillUpdate(nextProps, nextState) {
    if (this.props.token!==nextProps.token){
      nextProps.token && await this.props.getCurrentUser();
      if(this.props.permissions && !this.props.permissions.find(perm=>perm.source.toLowerCase()===this.props.location.pathname.toLowerCase())){
        this.props.location.pathname!=="/" && browserHistory.push("/")
      };
    }
  }

  handleGoHome() {
    browserHistory.push('/');
  }
  
  openLogoutModal(e) {
    e.preventDefault();
    this.props.getConfirmModal({
        body: (<div className="modalFormRow">
                <label>{getLocaleText("sure")}</label>
               </div>),
        callback: this.handleLogout.bind(this),
        open: true
    })
  }

  handleLogout() {
    this.props.handleLogin(false,"");
  }

  openUserModal(e){
    this.setState({errors:[]});
    if(e){
      e.preventDefault();
      
    }
    this.props.getConfirmModal({
      body:(<form id="passwordForm">
             <div className="modalFormRow">
             <label>{getLocaleText("oldPass")}</label>
             <input style={{border:this.state.errors.includes("old")?"1px solid red":"1px solid transparent"}} type="password" name="old"/>
             </div>
              <div className="modalFormRow">
             <label>{getLocaleText("newPass")}<div className="supTooltip">*<span>Password should contain at least number,letter,capitalized letter and its length should be longer than 8 characters</span></div></label>
             <input style={{border:this.state.errors.includes("new")?"1px solid red":"1px solid transparent"}} type="password" name="new"/>
             </div>
             <div className="modalFormRow">
             <label>{getLocaleText("confirmPass")}</label>
             <input style={{border:this.state.errors.includes("confirm")?"1px solid red":"1px solid transparent"}} type="password" name="confirm"/>
             </div>
             </form>),
      callback:this.handleChangePassword.bind(this),
      open:true
    })
  }

  async handleChangePassword(e) {
      let form = document.getElementById('passwordForm');
      e.preventDefault();
      let errorMessage="";
      let errors=[];
      switch(true){
        case !form.old.value:
          errorMessage+="Fill the old password field.";
          errors.push("old");
          break;
        case !form.new.value:
          errorMessage+="Fill the new password field.";
          errors.push("new");
          break;
        case !form.confirm.value:
          errorMessage+="Fill the confirm password field.";
          errors.push("confirm");
          break;
        case (form.old.value===form.new.value || form.old.value===form.confirm.value):
          errorMessage+="Old and new passwords are equal.";
          errors=errors.concat(["new","old","confirm"]);
          break;
        case (form.new.value !== form.confirm.value):
          errorMessage+="New and confirm passwords are different.";
          errors=errors.concat(["new","confirm"]);
          break;
        default:
      }
      this.setState({errors:errors},()=>{this.refs.confirm.selector.props.closeConfirmModal();this.openUserModal(new Event("Hello"))});
      if (errorMessage){
        throw new Error(errorMessage)
      }
      await request(`api/users/changepassword`, {
          method: "POST",
          body: JSON.stringify({
              "id": this.props.userid,
              "oldPassword": form.old.value,
              "newPassword": form.new.value
          })
      }, 'json').then(res=>{
        if(res.error){
          setTimeout(this.openUserModal.bind(this),0)
        } else {
          this.props.setErrorText("Password changed",2000,true);
        }

      })

  }

  changeLocale(){
    this.props.changeLocale(this.props.locale==="sp"?"en":"sp")
  }

  render() {
    const location=this.props.location.pathname;
    let menus={};
    const permissions=this.props.permissions;
    if(this.props.roles !== undefined){
      menus=this.props.route.childRoutes.reduce((prev,curr)=>{
        prev[curr.path]=getLocaleText(curr.path);
        return prev;
      },{});
    }
    return (
      <div className='app-container'>
        <header className={`header ${this.state.scrolled?" scrolledHeader":""}`}>
        <div className="headerContent">
          <div className="logoContainer"><div className="logo" onClick={this.handleGoHome.bind(this)}/></div>
          <ul className="pageNav">
            <li><a href="#">Главная</a></li>
            <li><a href="#">Метод</a></li>
            <li><a href="#">Услуги</a></li>
            <li><a href="#">Команда</a></li>
            <li><a href="#">Частые вопросы</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
          <div className="phone" >

            <button>Заказать звонок</button>
          </div>  
          </div>
         </header>
         <div className="content">
          {this.props.children}
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = ({App}) => {
  return {
    token: App.token,
    login: App.login,
    username:App.user.name,
    userid:App.user.id,
    roles:App.user.roles,
    permissions:App.user.permissions,
    locale:App.locale,
    logo:App.logo,
    visabilLogo:App.visabilLogo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentUser:()=>dispatch(getCurrentUser()),
    handleLogin: (token,login) => dispatch(handleLogin(token,login)),
    getConfirmModal:(confirm)=>dispatch(getConfirmModal(confirm)),
    setErrorText:(text,time=1500,success)=>dispatch(setErrorText(text,time,success)),
    changeLocale:(locale)=>dispatch(changeLocale(locale))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
