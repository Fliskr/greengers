import React,{PureComponent} from 'react';
import styles from './Settings.m.css';
import {request} from '../../utils/request';
import ReactTable from 'react-table';

class Settings extends PureComponent{

	constructor(props) {
		super(props);
		this.state={settings:[]}
	}
	componentWillMount() {
		this.getSettings();
	}

	getSettings(){
		request('api/settings').then(settings=>this.setState({settings:settings || []}));
	}

    handleImageLoad(row,e){
   	var input = e.target;

    var reader = new FileReader();
    reader.onload = ()=>{
      let dataURL = reader.result;
      console.log(dataURL.split(",")[1])
      dataURL=dataURL.split(",")[1];
      request(`api/settings/id/${row.id}`,{method:"PUT",body:JSON.stringify({...row,value:dataURL})}).then(this.getSettings.bind(this))
    };
    reader.readAsDataURL(input.files[0]);
    }


	render(){
		const columns=[
		{header:"id",accessor:"id",show:false},
		{header:"Name",accessor:"note"},
		{header:"Server Name",accessor:"name"},
		{header:"type",accessor:"type",show:true},
		{header:"value",accessor:"value",minWidth:200,render:({index,row,value})=>{
				if(row.type==="RESOURCE"){
					return (<div>
						
						<label htmlFor={"pic"+index}>
							<img 
								alt=""
								width="200px"  
								src={"data:image/png;base64,"+value} 
								className={styles.img} />
						</label>
						<input 
						id={"pic"+index}
						className={styles.imgLoader}
						name={"pic"+index}
						type="file" 
						onChange={this.handleImageLoad.bind(this,row)}
						 />
					</div>)
				}else{
					;
					return (<input type="text" value={value} onChange={e=>{
					let settings=[...this.state.settings];
					settings[index]={...settings[index],value:e.target.value};
					this.setState({settings:settings})}
				} onBlur={e=>request(`api/settings/id/${row.id}`,{method:"PUT",body:JSON.stringify({...row,value:e.target.value})}).then(this.getSettings.bind(this))}/>);
				}

			}},];
		return (<div><ReactTable defaultPageSize={40} data={this.state.settings} columns={columns} /></div>)
	}
}

export default Settings;
