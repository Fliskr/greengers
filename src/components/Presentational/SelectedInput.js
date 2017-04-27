import React ,{PureComponent} from 'react';

class SelectedInput extends PureComponent{
	render(){
		return (
					<div style={{display:"flex",flexDirection:"row",flex:"1"}}>
						<input type="text" value={this.props.inputValue} onChange={this.props.onChange.bind(this)}/>
						<select style={{display:"flex",flex:"0 1 30px",width:"20px"}}value={this.props.value} onChange={this.props.onChange.bind(this)}>
						<option value=""></option>
						{this.props.children}</select>
						<button style={{background:"rgba(200, 200, 200, 0.4)",padding:"0",margin:"0",height:"inherit",color:"white"}} onClick={this.props.onClick.bind(this)}>+</button>
					</div>
			)
	}
}

export default SelectedInput;