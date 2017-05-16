import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      scrolled:false,
      loading:0
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
 
  render() {

    return (
      <div className='app-container'>
        <div className="loadingLine"></div>
        <header className={`header ${this.state.scrolled?" scrolledHeader":""}`}>
        <div className="headerContent">
          <div className="logoContainer"><div className="logo" /></div>
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
   
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
   
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
