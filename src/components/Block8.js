import React,{PureComponent} from 'react';
import styles from './Block8.m.css';

class Block8 extends PureComponent{

	render(){
		return(
			<div className={styles.container}>
				<h2>Наши партнеры</h2>
				<hr/>
				<p>Часть компаний с которыми мы сотрудничаем<br/> или услугами которых мы пользуемся</p>
				<div className={styles.imgBlock}>
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/1.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/2.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/3.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/4.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/5.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/6.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/7.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/8.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/9.png')"}} />
					<div className={styles.img} style={{backgroundImage:"url('/static/img/partners/10.png')"}} />
				</div>
			</div>
			)
	}
}

export default Block8