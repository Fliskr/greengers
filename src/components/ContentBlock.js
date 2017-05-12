import React,{PureComponent} from 'react';
import styles from './ContentBlock.m.css';


class ContentBlock extends PureComponent{


render(){
	let blockClass=this.props.blockName?(this.props.blockName +" "+styles.block):(styles.block);

	return (<div className={blockClass}>
				<div className={ this.props.className+" " +styles.inner}>
					{this.props.children}
				</div>
			</div>)
}
}

export default ContentBlock;