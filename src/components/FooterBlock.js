import React,{PureComponent} from 'react';
import styles from './FooterBlock.m.css';
import Modal from './Modal';

class FooterBlock extends PureComponent{
	constructor(props) {
		super(props);
		this.state={open:false};
		this.toggleOpen=this.toggleOpen.bind(this);
	}

	toggleOpen(){
		this.setState({open:!this.state.open});
	}

	render(){
		return(
			<footer className={styles.footer}>
				<div className={styles.firstRow}>
					<div className='logo'></div>
					<div onClick={this.toggleOpen} className={styles.terms} >
						Политика конфиденциальности 
						<Modal isOpen={this.state.open} onClose={this.toggleOpen} />
					</div>
					<div>8(800)3002020</div>
				</div>
				<div className={styles.secondRow}>
					<div className={styles.social}>
						<a href=""><span><i className="fa fa-vk" /></span></a>
						<a href=""><span><i className="fa fa-youtube-play" /></span></a>
						<a href=""><span><i className="fa fa-instagram" /></span></a>
					</div>
					<div>2012-2017</div>
					<div><button /></div>
				</div>
			</footer>
			)
	}
}


export default FooterBlock;