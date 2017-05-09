import React,{PureComponent} from 'react';
import styles from './Main.m.css';
import ContentBlock from './ContentBlock';
import Slider from './Slider';

class Main extends PureComponent{
	render(){
		return (<div className={styles.main}>
		<ContentBlock blockName={styles.sec0img} className={styles.sec0}>
			<h1>Продающий маркетинг под ключ</h1>
			<hr/>
			<p><b>Который увеличит вашу прибыль минимум на 30% за 14 рабчих дней, благодаря тщательному анализу и упаковке вашего бизнеса</b></p>
			<p>Нажмите на кнопку ниже, чтобы получить бесплатную консультацию от наших специалистов</p>
			<button>Получить консультацию</button>
		</ContentBlock>
		<ContentBlock className={styles.sec1}>
			<div className={styles.funnelBlock} >
				<div className={styles.funnel}>
					<div className={styles.hiveBgLogo}></div>
					<div className={styles.funnelContent}>
						<h1>Бизнес - это воронка</h1>
						<hr/>
						<h2 className={styles.firstH2}><b>Самая большая проблема</b></h2>
						<br/>
						<p>в том, что большинство предпринимателей 
						не понимает из чего складывается процесс привлечения
						новых клиентов из интернета.</p>
						<p>Этот процесс можно <b>проанализировать</b>, <b>оцифровать </b> и <b>настроить</b> для получения максимальной выгоды.
						</p>
						<br/>
						<h2 className={styles.lastH2}>Мы делаем маркетинг который продаёт!</h2>
					</div>
				</div>
				<Slider className={styles.slider} 
					textComponent={
						(<h2 className={styles.clickableHeader}>Нажмите, чтобы прочитать подробнее про "Бизнес воронку" и как мы делаем Продающий маркетинг:</h2>)
					}>
						<div> hello!!!!</div>
				</Slider>
			</div>
		</ContentBlock>
	
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