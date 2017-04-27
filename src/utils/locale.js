import locale from '../i18n/i18n';
import store from '../store';

export default function getLocaleText(name){
	if(!name){
		return "";
	}
	if(!locale[name]){
		return name;
	}
	const lang = store.getState().App.locale;
	if(!locale[name][lang]){
		return Object.values(locale[name])[0];
	}
	return locale[name][lang];
}
