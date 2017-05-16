import React,{PureComponent} from 'react';
import styles from './Block7.m.css';

class Block7 extends PureComponent{

	render(){
		return(
			<div className={styles.container}>
				<h2>Наша команда</h2>
				<hr/>
				<p>Нам удалось собрать профессиональную команду из дизайнеров,<br/> программистов и специалистов в интернет-рекламе</p>
				<div className={styles.imgBlock}>
					<div className={styles.img}>
					<div style={{backgroundImage:"url('/static/img/team/1.png')"}} className={styles.logo} />
						<p><b>Дмитрий Комаров</b></p>
						<p className={styles.shortP}>Главный маркетолог</p>
					</div>
					<div className={styles.img}>
					<div style={{backgroundImage:"url('/static/img/team/1.png')"}} className={styles.logo} />
						<p><b>Вероника Бородина</b></p>
						<p className={styles.shortP}>Проджект менеджер</p>
					</div>
					<div className={styles.img}>
					<div style={{backgroundImage:"url('/static/img/team/1.png')"}} className={styles.logo} />
						<p><b>Кир Оболенский</b></p>
						<p className={styles.shortP}>Главный дизайнер</p>
					</div>
					<div className={styles.img}>
					<div style={{backgroundImage:"url('/static/img/team/1.png')"}} className={styles.logo} />
						<p><b>Александр Голубев</b></p>
						<p className={styles.shortP}>Специалист контектолог</p>
					</div>
					<div className={styles.img}>
					<div style={{backgroundImage:"url('/static/img/team/1.png')"}} className={styles.logo} />
						<p><b>Павел Нагаев</b></p>
						<p className={styles.shortP}>Фронтенд разработчик</p>
					</div>
					<div className={styles.img}>
					<div style={{backgroundImage:"url('/static/img/team/1.png')"}} className={styles.logo} />
						<p><b>Артем Каревин</b></p>
						<p className={styles.shortP}>Профессионал копирайтер</p>
					</div>					
				</div>
			</div>
			)
	}
}

export default Block7