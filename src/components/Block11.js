import React,{PureComponent} from 'react';
import styles from './Block6.m.css';

class Block6 extends PureComponent{

	render(){
		return(
			<div className={styles.container}>
				<h1>Остались вопросы?</h1>
				<hr className={styles.hr}/>
				<h3>Свяжитесь с нами любым удобным спопобом<br/> и мы с радостью ответим на все вопросы</h3>
				<form className={styles.form}>
					<p>Для того, чтобы наш специалист Вам перезвонил <br/><b> заполните форму ниже прямо сейчас </b> </p>
					<hr/>
					<input type='text' ref="name" placeholder="Введите ваше имя" defaultValue="" />
					<input type='text' ref="phone" placeholder="Введите ваш телефон *" defaultValue="" />
					<button type='submit' >Заказать звонок</button>
				</form>
			</div>
			)
	}
}

export default Block6