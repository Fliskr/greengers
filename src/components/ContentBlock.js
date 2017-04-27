import React,{PureComponent} from 'react';
import styles from './ContentBlock.m.css';


class ContentBlock extends PureComponent{


render(){
	return (<div className={styles.block}>
				<div className={styles.inner +" " +this.props.className}>
					{this.props.children}
				</div>
			</div>)
}
}

export default ContentBlock;