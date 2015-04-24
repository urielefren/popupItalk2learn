$(document).ready(function() {
   	//iniciar el controlador y llamar a la funcion loadPage
   	principalCtl = new IndexController();
	principalCtl.loadPage();
});

function IndexController() {
	//variables
	var scope =  this;
	this.lang =  ""; // variable del idioma
	
	this.dataLang = null;
	
	this.loadPage =  function (){
		scope.lang = getURLParameter("lang");//obtener el idioma de la url, si es 'en' es ingles, otro caso (sp o null) es español
		
		var theLangScript = "js/labels_sp.js";//etiquetas en español
		if(scope.lang!="sp"){
			theLangScript = "js/labels_en.js";//etiquetas en ingles
		}
		
		else{
			$("#t").html("Hola");
			$("#lang").html("English");
			$("#next").attr("value","Siguiente Ejercicio");
		}
		
		loadScript(theLangScript, scope.prepareLabels); //cargar script de idioma
		
		$("#questionsDialog").hide();
		
		$("#next").click(function() {
			$( "#questionsDialog" ).dialog({
				minWidth: 600,
				maxWidth: 600,
				minHeight: 600,
				maxHeight: 600,
				modal: true,
				buttons: [
				{
					text: "Send",
				    icons: {
				    	primary: "ui-icon-disk"
				    },
					click: function() {
						var json = scope.buildJSONResponse();
				        if(json!=null && json!=undefined){
				        	alert("Datos enviados:"+JSON.stringify(json));
				        	$( this ).dialog( "close" );
				        	scope.cleanForm();
				        }
				        
				    }
				}
				],
				close: function(event, ui) { 
				    scope.cleanForm();
				}
			});
		});
		
		$("#lang").click(function() {
			var thelang = "en";
			if(scope.lang=="en")
				thelang="sp";
			window.location='./index.html?lang='+thelang;
		});
	};
	
	/*******************************************************************/
	//funcion que se pasa como parametro a la funcion general loadScript
	//obtiene las etiquetas en un idioma y se ponen a cada componente de la pagina
	this.prepareLabels = function(data, textStatus, jqxhr){
		scope.dataLang = labels;
		$.map(labels, function(obj, index) {//entra a este ciclo si existe la carpeta e incrementa al sentinela para evitar crear otra carpeta para este evento
			if(index=="title"){
				$("#questionsDialog").attr("title",obj);
			}
			else{
				$("#questionsDialog").append("<label id='laQu"+index+"'>"+ obj.labelQues+":</label><br>");
				$("#questionsDialog").append("<img title='"+obj.labelAns1+"' id='r"+index+"1' src='resources/1.png' width='45' height='45' hspace='10' class='imOpt'>");
				$("#r"+index+"1").click(function() {
					scope.facePressed(index, 1);
				});
				$("#questionsDialog").append("<img title='"+obj.labelAns2+"' id='r"+index+"2' src='resources/2.png' width='45' height='45' hspace='10' class='imOpt'>");
				$("#r"+index+"2").click(function() {
					scope.facePressed(index, 2);
				});
				$("#questionsDialog").append("<img title='"+obj.labelAns3+"' id='r"+index+"3' src='resources/3.png' width='45' height='45' hspace='10' class='imOpt'>");
				$("#r"+index+"3").click(function() {
					scope.facePressed(index, 3);
				});
				$("#questionsDialog").append("<br><br>");
			}
		});
	};
	
	this.buildJSONResponse = function(){
		var json = null;
		var arr = [];
		$.map(scope.dataLang, function(obj, index) {
			if(index!="title"){
				var ind = scope.returnSelectedAns(index);
				if(ind!=null && ind!="" && ind!=undefined){
					var res = $(ind).attr("title");
					arr.push(res);
				}
			}
		});
		
		if(arr.length!=scope.countAnswers()){
			var msg = "Please, You must respond all questions!";
			if(scope.lang!="en"){
				msg = "Por favor, responde a todas las preguntas";
			}
			arr = null;
			alert(msg);
		}
		
		if(arr!=null){
			var jsonStr = "{ ";
			for(var i=0; i<arr.length;i++){
				jsonStr += '"'+(i+1)+'": "'+arr[i]+'",';
			}
			jsonStr = jsonStr.substring(0, jsonStr.length-1);
			jsonStr+=" }";
			console.log(jsonStr);
			json = JSON.parse(jsonStr);
		}
		return json;
	}
	
	this.cleanForm = function(){
		$.map(scope.dataLang, function(obj, index) {
			if(index!="title"){
				$("#r"+index+1).removeClass('selected');
				$("#r"+index+2).removeClass('selected');
				$("#r"+index+3).removeClass('selected');
			}
		});
	}
	
	this.countAnswers = function(){
		var cont = 0;
		$.map(scope.dataLang, function(obj, index) {
			if(index!="title"){
				cont++;
			}
		});
		return cont;
	}
	
	this.returnSelectedAns = function(id1){
		var res= "";
		for(var i=1;i<=3;i++){
			if(scope.askSelect(id1,i)){
				res = "#r"+id1+i;
				break;
			}
		}
		return res;
	};
	
	this.askSelect = function(id1, id2){
		return $("#r"+id1+id2).hasClass('selected');
	}
	
	this.removeSelect = function(id1, id2){
		if(scope.askSelect(id1,id2)){
			$("#r"+id1+id2).removeClass('selected');
		}
	}
	
	this.facePressed = function(index1, index2){
		scope.removeSelect(index1, 1);
		scope.removeSelect(index1, 2);
		scope.removeSelect(index1, 3);
		$("#r"+index1+index2).addClass('selected');
	};
}