import React,{PureComponent} from 'react';
import styles from './Block6.m.css';

class Block6 extends PureComponent{

	render(){
		return(
			<div className={styles.container}>
				<h1>Индивидуальный просчет стоимости</h1>
				<hr className={styles.hr}/>
				<h3>Стоимость каждого проекта индивидуальна<br/> и формируется в зависимости от 12 факторов.</h3>
				<form className={styles.form}>
					<p>Для бесплатного просчета стоимости вашего проекта <br/><b> заполните форму ниже прямо сейчас </b> </p>
					<hr/>
					<input type='text' ref="name" placeholder="Введите ваше имя" defaultValue="" />
					<input type='text' ref="phone" placeholder="Введите ваш телефон *" defaultValue="" />
					<button type='submit' >Просчитать стоимость</button>
				</form>
			</div>
			)
	}
}

export default Block6