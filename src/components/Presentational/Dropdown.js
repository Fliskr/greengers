import React,{PureComponent} from 'react';
import styles from './Dropdown.m.css';
class Dropdown extends PureComponent {

  constructor(props, context) {
    super(props, context);

    // Dropdown block is inactive & hidden by default
    this.state = {
      dropdownIsActive: false,
      dropdownIsVisible: false,
    };

    // We should bind `this` to click event handler right here
    this._hideDropdown = this._hideDropdown.bind(this);
  }

	  // componentDidMount() {
	  //   // Hide dropdown block on click outside the block
	  //   window.addEventListener('click', this._hideDropdown.bind(this), false);
	  // }


	  // componentWillUnmount() {
	  //   // Remove click event listener on component unmount
	  //   window.removeEventListener('click', this._hideDropdown.bind(this), false);
	  // }

  _toggleDropdown() {
    const { dropdownIsVisible } = this.state;

    // Toggle dropdown block visibility
    this.setState({ dropdownIsVisible: !dropdownIsVisible,dropdownIsActive: !dropdownIsVisible });
  }


  _hideDropdown() {
    const { dropdownIsActive } = this.state;

    // Hide dropdown block if it's not active
    if(!dropdownIsActive){
      this.setState({ dropdownIsVisible: false });
    }
    
  }


  _handleFocus() {
    // Make active on focus
    this.setState({ dropdownIsActive: true,drowdownIsVisible:true });
  }


  _handleBlur() {
    // Clean up everything on blur
    setTimeout(()=>this.setState({
      dropdownIsVisible: false,
      dropdownIsActive: false,
    }),100);
  }

  _renderDropdown() {
    const dropdownId = this.props.id;
    const { dropdownIsVisible } = this.state;

    return (
      <div
        className={`${styles.wrapper} ${this.state.dropdownIsVisible?styles.open:""}`}
        tabIndex={dropdownId}
      
        onClick={this._toggleDropdown.bind(this)}
      >
        <button className={styles.toggler}   
        onFocus={this._handleFocus.bind(this)}
        	onBlur={this._handleBlur.bind(this)}>
           {this.props.name}
        </button>
        {
          dropdownIsVisible &&
          <div className={styles.content}>
              {this.props.children}
          </div>
        }
      </div>
    );
  }


  render() {
    return (
      <div className={styles.dropdown} onClick={this._toggleDropdown.bind(this)}>
        
        {this._renderDropdown()}
      </div>
    );
  }

}

export default Dropdown