/**
 * 
 */

//funcion para importar otros recursos (javascript, css) dinamicamente cuando se necesiten
function loadScript(url, funcionRegreso) {
    $.getScript(url, funcionRegreso);
}

//funcion para obtener parametros en GET de url actual
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||"en";
}