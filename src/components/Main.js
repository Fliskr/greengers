import React,{PureComponent} from 'react';
import styles from './Main.m.css';
import ContentBlock from './ContentBlock';


class Main extends PureComponent{
	render(){
		return (<div className={styles.main}>
		<ContentBlock className={styles.sec1}>
		<div className={styles.funnelBlock} >
			<div className={styles.funnel}>
			<div className={styles.hiveBgLogo}></div>
			<div className={styles.funnelContent}>
				<h1>Бизнес - это воронка</h1>
				<br/>
				<br/>
				<h2><b>Самая большая проблема</b></h2>
				<p>в том, что большинство предпринимателей не</p>
				<p>понимают из чего складывается привлечение</p>
				<p>новых клиентов из интернета.</p>
				<p>
					Этот процесс можно 
					<b> измерить </b>,
					<b>оцифровать </b>
					и
				</p>
				<p>
					<b>изменить </b>
					в нужную нам сторону.
				</p>
				<br/>
				<br/>
				<h2>Мы делаем маркетинг </h2><h2>который продаёт!</h2>
			</div>
			</div>
			<div className={styles.slider}>
				<h2 className={styles.clickableHeader}>Нажмите, чтобы прочитать подробнее про "Бизнес воронку" и как мы делаем Продающий маркетинг:</h2>
			</div>
			</div>
		</ContentBlock>
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>
		</div>)
	}
}

export default Main;