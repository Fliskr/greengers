import React,{PureComponent} from 'react';
import styles from './ContentBlock.m.css';


class ContentBlock extends PureComponent{


render(){
	let blockClass=this.props.blockName?(styles.block+" "+this.props.blockName):(styles.block);

	return (<div className={blockClass}>
				<div className={styles.inner +" " +this.props.className}>
					{this.props.children}
				</div>
			</div>)
}
}

export default ContentBlock;