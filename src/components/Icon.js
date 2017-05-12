import React from 'react';
import styles from './Icon.m.css';

const Icon=({icon="",text=""})=>{
	return 	(<div className={styles.icon}>
			<img src={icon} alt={text}/>
			<p>{text}</p>
		</div>)
}

export default Icon;