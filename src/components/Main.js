import React,{PureComponent} from 'react';
import styles from './Main.m.css';
import ContentBlock from './ContentBlock';
import Slider from './Slider';
import FirstSlider from './FirstSlider';
import SecondSlider from './SecondSlider';
import Icon from './Icon';
import Block6 from './Block6';
import Block7 from './Block7';
import Block8 from './Block8';
import Block9 from './Block9';
import Block10 from './Block10';
import Block11 from './Block11';
import FooterBlock  from './FooterBlock';

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
		<ContentBlock className={styles.sec1} blockName={styles.sec1block}>
			<div className={styles.funnelBlock} >
				<div className={styles.funnel}>
					<div className={styles.hiveBgLogo}></div>
					<div className={styles.funnelContent}>
						<h1>Бизнес - это воронка</h1>
						<hr/>
						<p className={styles.bigP}><b>Самая большая проблема</b></p>
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
					<SecondSlider />
				</Slider>
			</div>
		</ContentBlock>
		<ContentBlock>
			<FirstSlider />
		</ContentBlock>
		<ContentBlock className={styles.sec2} blockName={styles.sec2block}>
			<div className={styles.sec2Top} >
				<div className={styles.aside}>
					<h1>Выберите желаемую услугу</h1>
					<hr/>
					<p>Вы можете заказать каждую услугу отдельно или сразу весь комплекс.</p>
					<button></button>
				</div>
				<div className={styles.actionsContainer}>
					<div className={styles.actions}>
						<div className={styles.action}>
							<h2>Создание посадочной страницы</h2>
							<button></button>
						</div>
						<div className={styles.action+" "+styles.mainAction}>
							<h2>Настройка Яндекс Директ</h2>
							<button></button>
						</div>
						<div className={styles.action}>
							<h2>Настройка Google Adwords</h2>
							<button></button>
						</div>
					</div>
					<div className={styles.actionsBottom}>
						<h2>Умный, автоматизированный e-mail маркетинг</h2>
						<p>Создаём автоматическую систему утепления и закрытия клиентов из интернета.<br/>С помощью автосерии писем, подписных и рекламы.</p>
						<button></button>
					</div>
				</div>
			</div>
			<div className={styles.sec2Bottom}>
			<h3>Другие услуги, которые мы реализовываем:</h3>
			<div className={styles.iconContainer}>
				<Icon icon="/static/img/icons/1.png" text="Аудит бизнеса и анализ рынка"/>
				<Icon icon="/static/img/icons/2.png" text="Web-дизайн"/>
				<Icon icon="/static/img/icons/3.png" text="Разработка стратегии продвижения"/>
				<Icon icon="/static/img/icons/4.png" text="Верстка и программирование"/>
				<Icon icon="/static/img/icons/5.png" text="Создание прототипа и тех. задания"/>
				<Icon icon="/static/img/icons/6.png" text="Поддержка и Обслуживание"/>
				<Icon icon="/static/img/icons/7.png" text="А/Б тестирование"/>
				<Icon icon="/static/img/icons/8.png" text="Подключение коллтрекинга"/>
			</div>
			</div>
		</ContentBlock>
		<ContentBlock blockName={styles.sec6block}><Block6 /></ContentBlock>
		<ContentBlock blockName={styles.sec7block}><Block7 /></ContentBlock>
		<ContentBlock blockName={styles.sec8block}><Block8 /></ContentBlock>
		<ContentBlock blockName={styles.sec9block}><Block9 /></ContentBlock>
		<ContentBlock blockName={styles.sec10block}><Block10 /></ContentBlock>
		<ContentBlock blockName={styles.sec11block}><Block11 /></ContentBlock>
		<FooterBlock />
{/*
		<ContentBlock></ContentBlock>
		<ContentBlock></ContentBlock>*/}
		</div>)
	}
}

export default Main;