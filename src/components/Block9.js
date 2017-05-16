import React,{PureComponent} from 'react';
import styles from './Block9.m.css';

class Block9 extends PureComponent{

	render(){
		return(
			<div className={styles.container}>
				<h2>Узнать стоимость</h2>
				<hr/>
				<p>Введите Ваш номер телефона, и мы просчитаем<br/>стоимость разработки проекта для Вас <b> совершенно бесплатно</b></p>
				<form className={styles.imgBlock}>
					<input type='text' ref="phone" defaultValue=""  placeholder="Введите ваш телефон*" />
					<button type='submit' >Узнать стоимость</button>
				</form>
			</div>
			)
	}
}

export default Block9